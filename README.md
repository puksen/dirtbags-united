# dirtbags-united

Community-based climbing app/website to create topos and make them available and free for everyone.

## Struktur

Das Projekt nutzt npm Workspaces.

Struktur (aktuell):

dirtbags-united/

- apps/
  - api/
    - src/
  - pwa/
    - public/
    - src/
      - assets/
      - components/
- packages/

## Installierte Pakete (aktuell)

### apps/api

Dependencies:

- express

DevDependencies:

- @types/express

### apps/pwa

Dependencies:

- react
- react-dom
- tailwindscss

DevDependencies:

- @eslint/js
- @tailwindcss/vite
- @types/node
- @types/react
- @types/react-dom
- @vitejs/plugin-react
- eslint
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- globals
- tailwindcss
- typescript
- typescript-eslint
- vite
