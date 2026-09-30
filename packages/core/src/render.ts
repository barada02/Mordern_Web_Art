import { mountain } from './elements/mountain'
import { tree } from './elements/tree'
import { boat, water } from './elements/water'
import { createNoise } from './noise'
import { resolvePalette } from './palettes'
import { hashSeed, randomSeed, Rng } from './rng'
import type { Ctx, LandscapeOptions } from './types'

let instanceCount = 0

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Render a complete landscape to an SVG string. Pure apart from unique element ids,
 * so it also works on the server or at build time.
 */
export function renderSVG(options: LandscapeOptions = {}): string {
  const seed = options.seed ?? randomSeed()
  const W = options.width ?? 1600
  const H = options.height ?? 600
  const D = clamp01(options.density ?? 0.6)
  const showTrees = options.trees ?? true
  const showWater = options.water ?? true
  const showGrain = options.grain ?? true
  const label = options.label ?? 'Generated Chinese ink landscape'

  const rng = new Rng(seed)
  const palette = resolvePalette(options.palette)
  const uid = `ss${hashSeed(seed).toString(36)}${(instanceCount++).toString(36)}`
  const ctx: Ctx = {
    rng,
    noise: createNoise(rng),
    palette,
    ids: { mist: `${uid}m`, grain: `${uid}g` },
  }

  const layers: string[] = []

  // Far range: soft washes near the horizon.
  const far: string[] = []
  const farCount = Math.round(3 + D * 4)
  for (let i = 0; i < farCount; i++) {
    far.push(mountain(ctx, {
      x: rng.range(-0.1, 1.1) * W,
      y: H * rng.range(0.52, 0.6),
      w: rng.range(0.25, 0.55) * W,
      h: rng.range(0.18, 0.38) * H,
      detail: 0,
      trees: false,
      washOnly: true,
    }))
  }
  layers.push(`<g opacity="0.45">${far.join('')}</g>`)

  // Middle range: textured, lighter ink.
  const mid: string[] = []
  const midCount = Math.round(1 + D * 3)
  for (let i = 0; i < midCount; i++) {
    mid.push(mountain(ctx, {
      x: W * ((i + rng.range(0.2, 0.8)) / midCount),
      y: H * rng.range(0.68, 0.74),
      w: rng.range(0.25, 0.45) * W,
      h: rng.range(0.25, 0.45) * H,
      detail: D * 0.6,
      trees: showTrees,
    }))
  }
  layers.push(`<g opacity="0.7">${mid.join('')}</g>`)

  // Water and a boat.
  if (showWater) {
    layers.push(water(ctx, H * 0.74, H, W))
    if (rng.chance(0.85)) layers.push(boat(ctx, W * rng.range(0.3, 0.7), H * rng.range(0.8, 0.9), H * 0.1))
  }

  // Near range: one or two dark masses anchored to a side, framing the scene.
  const nearCount = D > 0.5 ? 2 : 1
  const firstSide = rng.chance(0.5) ? -1 : 1
  for (let i = 0; i < nearCount; i++) {
    const side = i === 0 ? firstSide : -firstSide
    const x = side < 0 ? rng.range(0, 0.2) * W : rng.range(0.8, 1) * W
    const h = rng.range(0.4, 0.65) * H * (i === 0 ? 1 : 0.7)
    layers.push(mountain(ctx, { x, y: H * 1.02, w: rng.range(0.35, 0.55) * W, h, detail: D, trees: showTrees }))
    if (showTrees) {
      const clump = rng.int(1, 3)
      for (let k = 0; k < clump; k++) {
        layers.push(tree(ctx, x + rng.range(-0.08, 0.08) * W, H * rng.range(0.94, 1), H * rng.range(0.14, 0.24)))
      }
    }
  }

  const grainSeed = rng.int(0, 9999)
  const defs =
    `<defs>` +
    `<linearGradient id="${ctx.ids.mist}" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${palette.wash}" stop-opacity="0.32"/>` +
    `<stop offset="0.55" stop-color="${palette.wash}" stop-opacity="0.1"/>` +
    `<stop offset="1" stop-color="${palette.wash}" stop-opacity="0"/>` +
    `</linearGradient>` +
    (showGrain
      ? `<filter id="${ctx.ids.grain}" x="0" y="0" width="100%" height="100%">` +
        `<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="${grainSeed}" stitchTiles="stitch"/>` +
        `<feColorMatrix type="saturate" values="0"/>` +
        `<feComponentTransfer><feFuncA type="table" tableValues="0 0.09"/></feComponentTransfer>` +
        `</filter>`
      : '') +
    `</defs>`

  const grain = showGrain ? `<rect width="${W}" height="${H}" filter="url(#${ctx.ids.grain})"/>` : ''

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%" ` +
    `preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label.replace(/"/g, '&quot;')}">` +
    defs +
    `<rect width="${W}" height="${H}" fill="${palette.paper}"/>` +
    layers.join('') +
    grain +
    `</svg>`
  )
}
