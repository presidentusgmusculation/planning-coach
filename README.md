# Planning GitHub sync

Ce projet contient désormais une version de l'application qui peut charger les données depuis GitHub, tout en gardant le token hors du navigateur.

## 1) Préparer le dépôt

1. Créez un dépôt GitHub vide ou utilisez votre dépôt existant.
2. Ajoutez le fichier `data/planning.json` au dépôt.
3. Publiez le fichier `index.html` sur GitHub Pages ou sur la branche principale du dépôt.

## 2) Configurer le token

Copiez `.env.example` en `.env` puis remplacez par vos valeurs :

```bash
copy .env.example .env
```

Exemple :

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxx
GITHUB_REPO=presidentusgmusculation/planning-coach
GITHUB_BRANCH=main
GITHUB_FILE_PATH=data/planning.json
```

## 3) Synchroniser les données

Depuis le terminal :

```bash
node scripts/sync-planning.js push
```

Pour récupérer la version la plus récente depuis GitHub :

```bash
node scripts/sync-planning.js pull
```

## 4) L’interface web

Dans `index.html`, la configuration GitHub est située dans la section de variables du script. Modifiez l’URL si besoin :

```js
const GITHUB_PLANNING_URL = 'https://raw.githubusercontent.com/TON_USER/TON_REPO/main/data/planning.json';
```

## 5) Ce que cela apporte

- Les données de planning sont stockées dans un fichier JSON externe.
- Les modifications visibles dans le navigateur proviennent du dernier fichier JSON GitHub.
- Le token GitHub reste côté serveur/local, et n’est pas exposé dans le HTML.

> Important : un site statique hébergé sur GitHub Pages peut lire le JSON public, mais ne peut pas écrire directement dans le dépôt sans passer par un backend ou un script local avec token.
