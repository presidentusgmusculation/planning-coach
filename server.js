const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const rootDir = __dirname;

function loadDotEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=').trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, '');
    }
  }
}

loadDotEnv();

const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;
const branch = process.env.GITHUB_BRANCH || 'main';
const filePath = process.env.GITHUB_FILE_PATH || 'data/planning.json';

if (!repo || !token) {
  console.error('Variables manquantes : GITHUB_REPO et GITHUB_TOKEN');
  console.error('Crée un fichier .env ou variables d’environnement avant de lancer le serveur.');
  process.exit(1);
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function serveStaticFile(req, res) {
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const safePath = path.normalize(urlPath).replace(/^\.+/, '');
  const filePathToServe = path.join(rootDir, safePath);

  if (!filePathToServe.startsWith(rootDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePathToServe, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePathToServe).toLowerCase();
    const contentType = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    }[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

async function githubRequest(url, method = 'GET', body = null) {
  const headers = {
    'User-Agent': 'planning-github-sync',
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

async function writePlanningToGitHub(payload) {
  const content = JSON.stringify(payload, null, 2);
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

  const commitData = {
    message: 'Mise à jour du planning',
    content: encoded,
    branch,
    ...(sha ? { sha } : {})
  };

  await githubRequest(`https://api.github.com/repos/${repo}/contents/${filePath}`, 'PUT', commitData);
  return { ok: true, message: 'Planning envoyé vers GitHub avec succès.' };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.url === '/api/push-planning' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const result = await writePlanningToGitHub(payload);
          sendJson(res, 200, result);
        } catch (error) {
          console.error(error);
          sendJson(res, 500, { ok: false, message: error.message || 'Erreur lors de l\'envoi vers GitHub.' });
        }
      });
      return;
    } catch (error) {
      sendJson(res, 500, { ok: false, message: 'Erreur serveur.' });
      return;
    }
  }

  if (req.url.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Endpoint not found');
    return;
  }

  serveStaticFile(req, res);
});

server.listen(PORT, () => {
  console.log(`Serveur local démarré sur http://localhost:${PORT}`);
  console.log('Utilise les variables d’environnement GITHUB_REPO et GITHUB_TOKEN.');
});
