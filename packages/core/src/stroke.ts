import type { Noise2 } from './noise'

export type Pt = [number, number]

/** Round to one decimal to keep SVG output small. */
const f = (n: number) => Math.round(n * 10) / 10

export function pathFromPoints(pts: Pt[], close = false): string {
  return 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join('L') + (close ? 'Z' : '')
}

export interface BrushOptions {
  /** Maximum stroke width. */
  width: number
  noise: Noise2
  /** Noise channel, so strokes don't all wobble identically. */
  channel: number
  /** Taper exponent: lower = blunter ends. Default 0.6. */
  taper?: number
  /** Width variation along the stroke, 0..1. Default 0.6. */
  jitter?: number
}

/**
 * Turn a polyline into a filled outline whose width swells and tapers like a brush.
 * Returns an SVG path `d` string.
 */
export function brush(pts: Pt[], o: BrushOptions): string {
  const n = pts.length
  if (n < 2) return ''
  const taperExp = o.taper ?? 0.6
  const jitter = o.jitter ?? 0.6
  const left: Pt[] = []
  const right: Pt[] = []

  for (let i = 0; i < n; i++) {
    const prev = pts[Math.max(0, i - 1)]
    const next = pts[Math.min(n - 1, i + 1)]
    const dx = next[0] - prev[0]
    const dy = next[1] - prev[1]
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len
    const ny = dx / len

    const t = i / (n - 1)
    const taper = Math.pow(Math.sin(Math.PI * t), taperExp)
    const wobble = 1 - jitter / 2 + jitter * o.noise(i * 0.35, o.channel)
    const half = (o.width * (0.15 + 0.85 * taper) * wobble) / 2

    const [x, y] = pts[i]
    left.push([x + nx * half, y + ny * half])
    right.push([x - nx * half, y - ny * half])
  }

  return pathFromPoints([...left, ...right.reverse()], true)
}
