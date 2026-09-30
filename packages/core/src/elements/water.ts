import { brush, type Pt } from '../stroke'
import type { Ctx } from '../types'
import { fillPath } from './svg'

/** Sparse horizontal ripple strokes between y0 and y1, getting wider apart toward the viewer. */
export function water(ctx: Ctx, y0: number, y1: number, width: number): string {
  const { rng, noise, palette } = ctx
  const out: string[] = []
  const rows = Math.round((y1 - y0) / 7)

  for (let r = 0; r < rows; r++) {
    const t = r / rows
    const y = y0 + (y1 - y0) * t * t + rng.range(-2, 2)
    const count = rng.int(2, 6)
    for (let k = 0; k < count; k++) {
      if (!rng.chance(0.75 - t * 0.35)) continue
      const x = rng.range(-0.05, 1) * width
      const len = width * rng.range(0.02, 0.1) * (1 + t)
      const ch = rng.range(0, 1000)
      if (ctx.inSpace(x + len / 2, y) && rng.chance(0.85)) continue
      const pts: Pt[] = []
      for (let j = 0; j <= 6; j++) {
        const u = j / 6
        pts.push([x + len * u, y + (noise(u * 2, ch) - 0.5) * 3])
      }
      out.push(fillPath(brush(pts, { width: 0.7 + t * 0.9, noise, channel: ch }), palette.ink, rng.range(0.15, 0.35)))
    }
  }
  return `<g>${out.join('')}</g>`
}

/** A small fishing boat with a figure, centred at (x, y) on the water line. */
export function boat(ctx: Ctx, x: number, y: number, s: number): string {
  const { rng, noise, palette } = ctx
  const ch = rng.range(0, 1000)
  const dir = rng.chance(0.5) ? 1 : -1
  const out: string[] = []

  const hull: Pt[] = []
  for (let j = 0; j <= 10; j++) {
    const u = j / 10 - 0.5
    hull.push([x + u * s * dir, y + (0.25 - u * u) * s * 0.3 - (u > 0 ? u * s * 0.12 : 0)])
  }
  out.push(fillPath(brush(hull, { width: s * 0.07, noise, channel: ch, taper: 0.25 }), palette.ink))

  // Figure: body, conical hat, pole.
  const fx = x - s * 0.1 * dir
  out.push(fillPath(brush([[fx, y], [fx + s * 0.02 * dir, y - s * 0.14], [fx + s * 0.03 * dir, y - s * 0.24]], { width: s * 0.09, noise, channel: ch + 1, taper: 0.2 }), palette.ink, 0.9))
  const hy = y - s * 0.26
  out.push(fillPath(`M${fx - s * 0.08} ${hy + s * 0.02}L${fx + s * 0.03 * dir} ${hy - s * 0.06}L${fx + s * 0.12} ${hy + s * 0.02}Z`, palette.ink, 0.9))
  out.push(fillPath(brush([[fx + s * 0.05 * dir, y - s * 0.18], [fx + s * 0.45 * dir, y + s * 0.12]], { width: s * 0.02, noise, channel: ch + 2, taper: 0.2 }), palette.ink, 0.8))

  // Reflection ripples.
  for (let k = 0; k < 3; k++) {
    const ry = y + s * (0.12 + k * 0.06)
    const half = s * (0.45 - k * 0.1)
    out.push(fillPath(brush([[x - half, ry], [x, ry + 1], [x + half, ry]], { width: 0.9, noise, channel: ch + 5 + k }), palette.ink, 0.25))
  }
  return `<g>${out.join('')}</g>`
}
