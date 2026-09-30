import type { Noise2 } from './noise'
import type { Rng } from './rng'

export interface Palette {
  /** Background / paper colour. Also used to occlude shapes behind a mountain. */
  paper: string
  /** Main ink colour for strokes. */
  ink: string
  /** Colour of the misty wash on mountain faces. Defaults to `ink`. */
  wash?: string
}

export type PaletteName = 'sumi' | 'qinglu' | 'night' | 'mist'

export interface LandscapeOptions {
  /** Same seed → same painting. Defaults to a random seed. */
  seed?: string | number
  /** Palette name or a custom palette. Default `'sumi'`. */
  palette?: PaletteName | Palette
  /** Internal drawing width (viewBox units). Default 1600. */
  width?: number
  /** Internal drawing height (viewBox units). Default 600. */
  height?: number
  /** How busy the scene is, 0..1. Default 0.6. */
  density?: number
  /** Draw trees on mountains. Default true. */
  trees?: boolean
  /** Draw water and boats. Default true. */
  water?: boolean
  /** Subtle paper-grain texture. Default true. */
  grain?: boolean
  /** Accessible label for the SVG. */
  label?: string
}

/** Shared state passed to every element generator. */
export interface Ctx {
  rng: Rng
  noise: Noise2
  palette: Required<Palette>
  ids: { mist: string; grain: string }
}
