import type { Rng } from '../rng'
import type { Ctx, Distance } from '../types'
import { deep } from './deep'
import { high } from './high'
import { level } from './level'
import type { Scene } from './shared'

export type Composition = 'level' | 'high' | 'deep'

const ALIASES: Record<Distance, Composition> = {
  level: 'level',
  pingyuan: 'level',
  high: 'high',
  gaoyuan: 'high',
  deep: 'deep',
  shenyuan: 'deep',
}

export function resolveDistance(d: Distance | 'auto' | undefined, rng: Rng): Composition {
  if (!d || d === 'auto') return rng.pick(['level', 'high', 'deep'] as const)
  return ALIASES[d] ?? 'level'
}

export function compose(ctx: Ctx, distance: Composition, scene: Scene): string[] {
  if (distance === 'high') return high(ctx, scene)
  if (distance === 'deep') return deep(ctx, scene)
  return level(ctx, scene)
}
