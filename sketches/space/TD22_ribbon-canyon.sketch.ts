import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const LAYERS = 11
const SAMPLES = 76
const STEP = 0.72

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 6, 34)
  const camera = new THREE.PerspectiveCamera(56, ctx.width / ctx.height, 0.1, 80)
  camera.position.set(0, 1, 4)

  const strips = LAYERS * 2
  const pos = new Float32Array(strips * SAMPLES * 2 * 3)
  const col = new Float32Array(pos.length)
  const idx: number[] = []
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  for (let strip = 0; strip < strips; strip++) {
    const c = strip === 3 || strip === strips - 4 ? accent : signal
    for (let i = 0; i < SAMPLES; i++) {
      const v = (strip * SAMPLES + i) * 2
      for (let edge = 0; edge < 2; edge++) {
        const j = (v + edge) * 3
        col[j] = c.r
        col[j + 1] = c.g
        col[j + 2] = c.b
      }
      if (i < SAMPLES - 1) idx.push(v, v + 1, v + 3, v, v + 3, v + 2)
    }
  }
  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('position', posAttr)
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  geo.setIndex(idx)
  const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.72 })
  scene.add(new THREE.Mesh(geo, mat))
  const bend = ctx.random() * 20

  function canyon(t: number) {
    const scroll = t * 4.1
    const shift = Math.floor(scroll / STEP)
    const frac = scroll - shift * STEP
    for (let layer = 0; layer < LAYERS; layer++) {
      for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
        const side = sideIndex === 0 ? -1 : 1
        const strip = layer * 2 + sideIndex
        for (let i = 0; i < SAMPLES; i++) {
          const sampleZ = -(i + shift) * STEP
          const z = -i * STEP + frac
          const wall = 3.2 + Math.sin(sampleZ * 0.18 + bend) * 1.1 + Math.sin(sampleZ * 0.47 + layer) * 0.35
          const y = -2.2 + layer * 0.48 + Math.sin(sampleZ * 0.13 + layer * 0.4) * 0.16
          const k = (strip * SAMPLES + i) * 6
          pos[k] = side * wall
          pos[k + 1] = y
          pos[k + 2] = z
          pos[k + 3] = side * (wall + 0.7 + layer * 0.045)
          pos[k + 4] = y + 0.04
          pos[k + 5] = z
        }
      }
    }
    posAttr.needsUpdate = true
  }
  canyon(0)

  return {
    scene,
    camera,
    update(t) {
      canyon(t)
      camera.position.x = Math.sin(t * 0.31) * 0.8
      camera.position.y = 0.8 + Math.sin(t * 0.22) * 0.45
      camera.lookAt(Math.sin(t * 0.25) * 1.4, 0.5, -12)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
