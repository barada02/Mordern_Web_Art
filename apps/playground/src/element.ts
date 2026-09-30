import 'shanshui/element'
import type { ShanShuiElement } from 'shanshui/element'
import { randomSeed } from 'shanshui'
import './style.css'
import './element.css'

const live = document.querySelector<ShanShuiElement>('#live')!
const distances = ['level', 'high', 'deep']

document.getElementById('next')!.addEventListener('click', () => live.setAttribute('seed', randomSeed()))

document.getElementById('cycle')!.addEventListener('click', () => {
  const i = distances.indexOf(live.getAttribute('distance') ?? 'level')
  live.setAttribute('distance', distances[(i + 1) % distances.length])
})

document.getElementById('replay')!.addEventListener('click', () => live.replay())
