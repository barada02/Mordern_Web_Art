/** A filled path. Returns '' for empty paths so callers can concatenate freely. */
export function fillPath(d: string, color: string, opacity = 1): string {
  if (!d) return ''
  const o = opacity < 1 ? ` fill-opacity="${Math.round(opacity * 100) / 100}"` : ''
  return `<path d="${d}" fill="${color}"${o}/>`
}

export function circle(x: number, y: number, r: number, color: string, opacity = 1): string {
  const o = opacity < 1 ? ` fill-opacity="${Math.round(opacity * 100) / 100}"` : ''
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}"${o}/>`
}
