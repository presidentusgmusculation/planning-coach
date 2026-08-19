# Planning Hebdomadaire & Gestion du Personnel

Cette application est une page HTML statique destinée à être hébergée sur GitHub Pages.

## Fonctionnement

- En mode consultation : la page est en lecture seule.
- En mode président : le mot de passe est demandé pour autoriser les modifications.
- En mode consultation, seuls les boutons utiles à la lecture restent visibles, notamment l'impression.
- La gestion du planning est enregistrée localement dans le navigateur via `localStorage`.

## Fichiers nécessaires

- `index.html`
- `data/planning.json`

## Déploiement sur GitHub Pages

1. Crée un dépôt GitHub.
2. Uploade les fichiers `index.html` et `data/planning.json`.
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
