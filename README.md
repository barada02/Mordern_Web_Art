# shanshui 山水

Procedurally generated Chinese ink landscapes for the web. Seeded, dependency-free SVG.
Inspired by Lingdong Huang's [{Shan, Shui}*](https://github.com/LingDong-/shan-shui-inf).

## Repo layout

```
packages/core      → the `shanshui` npm library
apps/playground    → Vite app that consumes the library exactly like a user would
```

## Develop

```sh
npm install
npm run dev        # builds the library in watch mode + starts the playground
npm run build      # builds everything
npm run typecheck
```

## Usage

```js
import { createLandscape } from 'shanshui'

const art = createLandscape('#hero', { seed: 'my-post', palette: 'sumi', density: 0.6 })
art.update({ palette: 'night' })
art.toSVG() // SVG string
```

Server / build time:

```js
import { renderSVG } from 'shanshui'
const svg = renderSVG({ seed: 'my-post' })
```
