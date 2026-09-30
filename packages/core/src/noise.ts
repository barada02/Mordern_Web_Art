import type { Rng } from './rng'

/** 2D gradient noise, output roughly in [0, 1]. Use `y` as an extra channel for independent 1D curves. */
export type Noise2 = (x: number, y?: number) => number

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function grad(hash: number, x: number, y: number): number {
  switch (hash & 3) {
    case 0: return x + y
    case 1: return -x + y
    case 2: return x - y
    default: return -x - y
  }
}

/** Seeded Perlin noise. The permutation table is shuffled with `rng`, so output is deterministic per seed. */
export function createNoise(rng: Rng): Noise2 {
  const perm = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1))
    ;[perm[i], perm[j]] = [perm[j], perm[i]]
  }
  const p = new Uint8Array(512)
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255]

  return (x, y = 0) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const X = xi & 255
    const Y = yi & 255
    const fx = x - xi
    const fy = y - yi
    const u = fade(fx)
    const v = fade(fy)
    const aa = p[p[X] + Y]
    const ab = p[p[X] + Y + 1]
    const ba = p[p[X + 1] + Y]
    const bb = p[p[X + 1] + Y + 1]
    const r = lerp(
      lerp(grad(aa, fx, fy), grad(ba, fx - 1, fy), u),
      lerp(grad(ab, fx, fy - 1), grad(bb, fx - 1, fy - 1), u),
      v,
    )
    return (r + 1) / 2
  }
}
