# rayonday776.github.io

Ce dépôt sert le site GitHub Pages : https://rayonday776.github.io/

## Jeu 4X (prototype)

Le code du prototype 4X est organisé dans ce dépôt et sera publié sur le site via GitHub Pages.

### Dossiers principaux

- `public/` : page statique principale du jeu (HTML).
- `src/engine/` : règles du jeu (map, unités, combat, IA, production, boucle de tour).
- `src/ui/` : interface canvas + interactions utilisateur.
- `tests/` : tests unitaires du moteur.

## Développement local

```bash
npm test
npm run dev
```

Puis ouvrir `http://localhost:5173/public/`.
