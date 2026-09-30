import { createLandscape, palettes, randomSeed, type LandscapeOptions, type PaletteName } from 'shanshui'
import './style.css'

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T

const seedInput = $<HTMLInputElement>('seed')
const paletteSelect = $<HTMLSelectElement>('palette')
const density = $<HTMLInputElement>('density')
const densityOut = $<HTMLOutputElement>('densityOut')
const trees = $<HTMLInputElement>('trees')
const water = $<HTMLInputElement>('water')
const grain = $<HTMLInputElement>('grain')
const code = $<HTMLElement>('code')

for (const name of Object.keys(palettes)) paletteSelect.add(new Option(name, name))

// Seed from the URL hash so paintings are shareable.
const initialSeed = decodeURIComponent(location.hash.slice(1)) || randomSeed()
seedInput.value = initialSeed

const read = (): LandscapeOptions => ({
  seed: seedInput.value || '0',
  palette: paletteSelect.value as PaletteName,
  density: Number(density.value),
  trees: trees.checked,
  water: water.checked,
  grain: grain.checked,
})

const landscape = createLandscape('#stage', read())

function render() {
  const opts = read()
  densityOut.value = opts.density!.toFixed(2)
  landscape.update(opts)
  history.replaceState(null, '', `#${encodeURIComponent(String(opts.seed))}`)
  code.textContent =
    `import { createLandscape } from 'shanshui'\n\n` +
    `createLandscape('#hero', ${JSON.stringify(opts, null, 2)})`
}

$('controls').addEventListener('input', render)
$('shuffle').addEventListener('click', () => {
  seedInput.value = randomSeed()
  render()
})

$('download').addEventListener('click', () => {
  const blob = new Blob([landscape.toSVG()], { type: 'image/svg+xml' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `shanshui-${seedInput.value}.svg`
  a.click()
  URL.revokeObjectURL(a.href)
})

$('copy').addEventListener('click', async (e) => {
  const btn = e.currentTarget as HTMLButtonElement
  try {
    await navigator.clipboard.writeText(code.textContent ?? '')
    btn.textContent = 'Copied'
  } catch {
    btn.textContent = 'Copy failed'
  }
  setTimeout(() => (btn.textContent = 'Copy code'), 1200)
})

render()
