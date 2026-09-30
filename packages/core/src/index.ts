import { renderSVG } from './render'
import { randomSeed } from './rng'
import type { LandscapeOptions } from './types'

export { renderSVG } from './render'
export { palettes } from './palettes'
export { randomSeed } from './rng'
export type { LandscapeOptions, Palette, PaletteName } from './types'

export interface Landscape {
  /** Merge new options and redraw. */
  update(next: Partial<LandscapeOptions>): void
  /** The current SVG markup, e.g. for download. */
  toSVG(): string
  /** The resolved options, including the seed actually used. */
  readonly options: LandscapeOptions
  /** Remove the drawing from the target element. */
  destroy(): void
}

/**
 * Draw a landscape into an element (or CSS selector). The SVG fills the element,
 * so size the element with CSS.
 */
export function createLandscape(target: Element | string, options: LandscapeOptions = {}): Landscape {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) throw new Error(`shanshui: target "${String(target)}" not found`)

  let opts: LandscapeOptions = { ...options, seed: options.seed ?? randomSeed() }
  let svg = ''
  const draw = () => {
    svg = renderSVG(opts)
    el.innerHTML = svg
  }
  draw()

  return {
    update(next) {
      opts = { ...opts, ...next }
      draw()
    },
    toSVG: () => svg,
    get options() {
      return { ...opts }
    },
    destroy() {
      el.innerHTML = ''
    },
  }
}
