import { renderSVG } from './render'
import { randomSeed } from './rng'
import type { LandscapeOptions } from './types'

export { renderSVG } from './render'
export { palettes } from './palettes'
export { randomSeed } from './rng'
export { resolveSpace, spacePresets } from './space'
export type { Distance, LandscapeOptions, Palette, PaletteName, SpaceBox, SpacePreset } from './types'

export interface Landscape {
  /** Merge new options and redraw. */
  update(next: Partial<LandscapeOptions>): void
  /** The current SVG markup, e.g. for download. */
  toSVG(): string
  /** The resolved options, including the seed actually used. */
  readonly options: LandscapeOptions
  /** Stop observing size changes and remove the drawing. */
  destroy(): void
}

const BASE_HEIGHT = 600

/**
 * Draw a landscape into an element (or CSS selector). The SVG fills the element, so size
 * the element with CSS. Unless `width`/`height` are given, the drawing matches the element's
 * aspect ratio (so `space` lines up with your content) and redraws when that ratio changes.
 */
export function createLandscape(target: Element | string, options: LandscapeOptions = {}): Landscape {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) throw new Error(`shanshui: target "${String(target)}" not found`)

  let opts: LandscapeOptions = { ...options, seed: options.seed ?? randomSeed() }
  let svg = ''
  let drawnWidth = 0

  const fittedWidth = () => {
    const { width, height } = el.getBoundingClientRect()
    return width > 0 && height > 0 ? Math.round((BASE_HEIGHT * width) / height) : 0
  }

  const draw = () => {
    const fit = opts.width == null && opts.height == null
    const w = fit ? fittedWidth() : 0
    drawnWidth = w
    svg = renderSVG(w ? { ...opts, width: w, height: BASE_HEIGHT } : opts)
    el.innerHTML = svg
  }
  draw()

  let frame = 0
  const observer =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => {
          if (opts.width != null || opts.height != null) return
          const w = fittedWidth()
          if (!w || (drawnWidth && Math.abs(w - drawnWidth) / drawnWidth < 0.02)) return
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(draw)
        })
  observer?.observe(el)

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
      observer?.disconnect()
      cancelAnimationFrame(frame)
      el.innerHTML = ''
    },
  }
}
