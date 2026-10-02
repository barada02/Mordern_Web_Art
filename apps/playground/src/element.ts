import 'kalpa-shan/element'
import type { KalpaShanElement } from 'kalpa-shan/element'
import { randomSeed } from 'kalpa-shan'
import './style.css'
import './element.css'

const live = document.querySelector<KalpaShanElement>('#live')!
const distances = ['level', 'high', 'deep']

document.getElementById('next')!.addEventListener('click', () => live.setAttribute('seed', randomSeed()))

document.getElementById('cycle')!.addEventListener('click', () => {
  const i = distances.indexOf(live.getAttribute('distance') ?? 'level')
  live.setAttribute('distance', distances[(i + 1) % distances.length])
})

document.getElementById('replay')!.addEventListener('click', () => live.replay())
