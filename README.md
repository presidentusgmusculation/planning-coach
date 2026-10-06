# Planning Hebdomadaire & Gestion du Personnel

Cette application est une page HTML statique destinée à être hébergée sur GitHub Pages.

## Fonctionnement

- En mode consultation : la page est en lecture seule.
- En mode président : le mot de passe est demandé pour autoriser les modifications.
- En mode consultation, seuls les boutons utiles à la lecture restent visibles, notamment l'impression.
- `data/planning.json` est la source de données partagée par le planning complet et la page des dimanches.
- Le planning complet charge ce JSON au démarrage. Si le JSON n'a jamais été publié ou est inaccessible, il conserve les données intégrées au fichier HTML.
- Les modifications sont conservées dans la page pendant la session. Utilisez « Publier GitHub » pour mettre à jour ensemble le JSON partagé et le planning complet.

## Fichiers nécessaires

- `index.html`
- `dimanches.html` (consultation des dimanches uniquement)
- `data/planning.json`

Les deux pages utilisent `data/planning.json`. Après le déploiement initial, ouvrez le planning complet et utilisez « Publier GitHub » pour initialiser ce fichier avec les données actuellement intégrées. Ensuite, après toute modification, republiez depuis la page complète : le JSON partagé et le planning seront mis à jour ensemble.

## Déploiement sur GitHub Pages

1. Crée un dépôt GitHub.
2. Uploade les fichiers `index.html`, `dimanches.html` et `data/planning.json`.
3. Va dans les paramètres du dépôt.
4. Ouvre la section "Pages".
5. Sélectionne la branche principale (ou master) comme source.
6. Valide la publication.
7. Récupère l'URL fournie par GitHub Pages.

## Accès

- Choisir "Consultation (Lecture seule)" pour afficher le planning sans modifier.
- Choisir "Accès Président" pour entrer le mot de passe.

## Mot de passe président

Le mot de passe actuel est :

```text
Vickycarole
```

> Ce mot de passe est intégré dans la page pour l'accès présidentiel sur cette version statique.

## Notes

Cette version est optimisée pour un usage statique et ne synchronise pas automatiquement les données entre plusieurs appareils. Les modifications sont conservées dans le navigateur local utilisé.
