import type { SpaceBox, SpacePreset } from './types'

export const spacePresets: Record<Exclude<SpacePreset, 'none'>, SpaceBox> = {
  left: { x: 0.05, y: 0.1, width: 0.42, height: 0.5 },
  right: { x: 0.53, y: 0.1, width: 0.42, height: 0.5 },
  center: { x: 0.27, y: 0.1, width: 0.46, height: 0.48 },
  top: { x: 0.1, y: 0.04, width: 0.8, height: 0.34 },
}

/** Resolve a preset name or box into a fractional box, or null for no space. */
export function resolveSpace(space: SpacePreset | SpaceBox | undefined): SpaceBox | null {
  if (!space || space === 'none') return null
  if (typeof space === 'string') return spacePresets[space] ?? null
  return space
}

const smooth = (t: number) => t * t * (3 - 2 * t)

/**
 * Build the ceiling function: inside the box's x-range shapes must stay below the box,
 * with soft shoulders either side so mountains slope away instead of being cut off.
 */
export function makeCeiling(box: SpaceBox | null, W: number, H: number): (x: number) => number {
  if (!box) return () => -Infinity
  const x0 = box.x * W
  const x1 = (box.x + box.width) * W
  const floor = (box.y + box.height) * H + H * 0.02
  const margin = W * 0.1
  return (x) => {
    let s: number
    if (x <= x0 - margin || x >= x1 + margin) return -Infinity
    if (x < x0) s = smooth((x - (x0 - margin)) / margin)
    else if (x > x1) s = smooth((x1 + margin - x) / margin)
    else s = 1
    return floor - (1 - s) * H * 1.5
  }
}

export function makeInSpace(box: SpaceBox | null, W: number, H: number): (x: number, y: number) => boolean {
  if (!box) return () => false
  return (x, y) =>
    x >= box.x * W && x <= (box.x + box.width) * W && y >= box.y * H && y <= (box.y + box.height) * H
}
