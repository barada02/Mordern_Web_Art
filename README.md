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

### Composition: the three distances (三远)

After Guo Xi's 11th-century theory of landscape composition:

| `distance` | | View |
| --- | --- | --- |
| `'level'` | 平远 pingyuan | Wide, calm water with low hills far away |
| `'high'` | 高远 gaoyuan | Looking up at a towering main peak |
| `'deep'` | 深远 shenyuan | Looking into a valley of receding ranges |

Default is `'auto'`: the seed picks one.

### Space for your content (留白)

Keep part of the painting empty so text can sit on it. Mountains move and shrink out of the way, and a soft mist keeps the text readable.

```js
createLandscape('#hero', { seed: 'home', space: 'left' })          // 'left' | 'right' | 'center' | 'top'
createLandscape('#hero', { space: { x: 0.1, y: 0.1, width: 0.5, height: 0.4 } }) // fractions of the element
```

`resolveSpace(space)` returns the box as fractions, so you can position your own elements over it.

The drawing matches the element's aspect ratio and redraws on resize, so size the element with CSS.

### Animation

The painting can paint itself in, back to front, like a brush at work: distant washes fade in, ridge lines sweep across, then texture, water, the boat and the trees. After that, mist drifts, water shimmers and the boat bobs.

```js
const art = createLandscape('#hero', { seed: 'home', animate: true })
createLandscape('#hero', { animate: { duration: 4, motion: false } }) // reveal only
createLandscape('#hero', { animate: { reveal: false } })             // ambient motion only

art.replay()   // paint it in again
art.pause()
art.play()
```

- Off by default. Animation never changes the painting itself: same seed, same picture.
- Turned off automatically for users with `prefers-reduced-motion`, and paused while off-screen.
- Uses native SVG animation, so a downloaded `.svg` animates too. Tools that can't animate show the finished painting.

### Server / build time

```js
import { renderSVG } from 'shanshui'
const svg = renderSVG({ seed: 'my-post' })
```
