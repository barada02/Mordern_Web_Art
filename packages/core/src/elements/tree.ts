import { brush, type Pt } from '../stroke'
import type { Ctx } from '../types'
import { circle, fillPath } from './svg'

type TreeKind = 'pine' | 'leafy' | 'bare'
const KINDS: readonly TreeKind[] = ['pine', 'pine', 'leafy', 'bare']

/** A small tree rooted at (x, y), roughly `size` tall. */
export function tree(ctx: Ctx, x: number, y: number, size: number): string {
  const { rng, noise, palette } = ctx
  const ch = rng.range(0, 1000)
  const kind = rng.pick(KINDS)
  const lean = rng.range(-0.18, 0.18)
  const out: string[] = []

  const trunk: Pt[] = []
  const segs = 8
  for (let j = 0; j <= segs; j++) {
    const t = j / segs
    trunk.push([x + lean * size * t + (noise(t * 3, ch) - 0.5) * size * 0.15, y - size * t])
  }
  out.push(fillPath(brush(trunk, { width: size * 0.07, noise, channel: ch, taper: 0.2 }), palette.ink))

  const at = (t: number) => trunk[Math.round(t * segs)]

  if (kind === 'pine') {
    const layers = rng.int(3, 5)
    for (let l = 0; l < layers; l++) {
      const t = 0.4 + (0.6 * l) / (layers - 1)
      const [cx, cy] = at(t)
      const half = size * 0.34 * (1 - t * 0.55) * rng.range(0.8, 1.2)
      const needles: Pt[] = []
      for (let k = 0; k <= 6; k++) {
        const u = k / 3 - 1
        needles.push([cx + u * half, cy + Math.abs(u) * size * 0.04 + (noise(k, ch + l) - 0.5) * size * 0.03])
      }
      out.push(fillPath(brush(needles, { width: size * 0.09, noise, channel: ch + l * 7 }), palette.ink, 0.85))
    }
  } else if (kind === 'leafy') {
    const [cx, cy] = at(0.85)
    const blobs = rng.int(12, 20)
    for (let b = 0; b < blobs; b++) {
      const a = rng.range(0, Math.PI * 2)
      const r = size * 0.3 * Math.sqrt(rng.next())
      out.push(circle(cx + Math.cos(a) * r * 1.2, cy + Math.sin(a) * r * 0.7, size * rng.range(0.04, 0.08), palette.ink, rng.range(0.45, 0.85)))
    }
  } else {
    const branches = rng.int(3, 5)
    for (let b = 0; b < branches; b++) {
      const [bx, by] = at(rng.range(0.4, 0.9))
      const dir = rng.chance(0.5) ? -1 : 1
      const len = size * rng.range(0.2, 0.4)
      const pts: Pt[] = []
      for (let k = 0; k <= 5; k++) {
        const t = k / 5
        pts.push([bx + dir * len * t, by - len * 0.6 * t + (noise(t * 4, ch + b) - 0.5) * size * 0.08])
      }
      out.push(fillPath(brush(pts, { width: size * 0.035, noise, channel: ch + b, taper: 0.3 }), palette.ink))
    }
  }

  return out.join('')
}
