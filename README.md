# rayonday776.github.io
# essaie-4x (prototype)

Prototype web 4X en 2D "carte à plat" avec priorité aux règles et à l'IA.

## Démarrage

```bash
npm test
npm run dev
```

Puis ouvrir `http://localhost:5173/public/`.

## Objectifs du prototype

- Boucle de jeu tour par tour.
- Carte en grille 2D (terrain + coûts).
- Unités, villes, combat basique.
- IA simple (attaque si possible, sinon déplacement vers la ville ennemie).
- Production basique pour sortir de nouvelles unités.

## Structure

- `src/engine` : règles du jeu (map, unités, combat, IA, production, boucle de tour).
- `src/ui` : rendu HTML5 canvas + log minimal.
- `public` : page statique.
- `tests` : tests unitaires du moteur.
