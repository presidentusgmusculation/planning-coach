#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;
const branch = process.env.GITHUB_BRANCH || 'main';
const filePath = process.env.GITHUB_FILE_PATH || 'data/planning.json';

const rootDir = path.resolve(__dirname, '..');
const localFile = path.join(rootDir, filePath);
const localDir = path.dirname(localFile);

const command = process.argv[2] || 'push';

function ensureEnv() {
  if (!repo || !token) {
    console.error('Variables manquantes: GITHUB_REPO et GITHUB_TOKEN.');
    console.error('Créez un fichier .env basé sur .env.example puis relancez le script.');
    process.exit(1);
  }
}

async function githubRequest(url, method = 'GET', body = null) {
  const headers = {
    'User-Agent': 'planning-sync-script',
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${token}`
  };

  if (body !== null) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${text}`);
  }

  return response.status === 204 ? null : response.json();
}

async function pullFromGitHub() {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;
  const data = await githubRequest(url, 'GET');

  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  fs.mkdirSync(localDir, { recursive: true });
  fs.writeFileSync(localFile, content, 'utf8');

  console.log(`Données récupérées depuis GitHub : ${localFile}`);
}

async function pushToGitHub() {
  ensureEnv();
  const fileExists = fs.existsSync(localFile);
  if (!fileExists) {
    console.error(`Le fichier local n’existe pas : ${localFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(localFile, 'utf8');
  const encoded = Buffer.from(content, 'utf8').toString('base64');
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;

  let sha = null;
  try {
    const existing = await githubRequest(url, 'GET');
    sha = existing.sha;
  } catch (error) {
    if (!String(error.message).includes('404')) {
      throw error;
    }
  }

  const payload = {
    message: 'Mise à jour du planning',
    content: encoded,
    branch,
    ...(sha ? { sha } : {})
  };

  await githubRequest(`https://api.github.com/repos/${repo}/contents/${filePath}`, 'PUT', payload);
  console.log(`Données envoyées vers GitHub : ${repo}/${filePath}`);
}

(async () => {
  try {
    if (command === 'pull') {
      ensureEnv();
      await pullFromGitHub();
      return;
    }

    if (command === 'push') {
      await pushToGitHub();
      return;
    }

    console.log('Usage : node scripts/sync-planning.js [push|pull]');
    process.exit(1);
  } catch (error) {
    console.error('Erreur de synchronisation GitHub :');
    console.error(error.message);
    process.exit(1);
  }
})();
