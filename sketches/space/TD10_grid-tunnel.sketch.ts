import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const RINGS = 44
const SEG = 28
const SPACING = 1.15
const SPEED = 7.5
const R = 3.4

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 6, RINGS * SPACING)

  const camera = new THREE.PerspectiveCamera(62, ctx.width / ctx.height, 0.1, 90)
  camera.position.set(0, 0, 2)

  const vcount = RINGS * SEG
  const pos = new Float32Array(vcount * 3)
  const col = new Float32Array(vcount * 3)
  const idx: number[] = []
  for (let i = 0; i < RINGS; i++) {
    for (let s = 0; s < SEG; s++) {
      const v = i * SEG + s
      idx.push(v, i * SEG + ((s + 1) % SEG))
      if (i < RINGS - 1) idx.push(v, v + SEG)
    }
  }
  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  const colAttr = new THREE.BufferAttribute(col, 3)
  colAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('position', posAttr)
  geo.setAttribute('color', colAttr)
  geo.setIndex(idx)
  const mat = new THREE.LineBasicMaterial({ vertexColors: true })
  scene.add(new THREE.LineSegments(geo, mat))

  const cSignal = new THREE.Color(pal.signal)
  const cAccent = new THREE.Color(pal.accent)
  const spin = ctx.random() * Math.PI * 2
  let lastShift = -1

  function build(t: number) {
    const scroll = t * SPEED
    const shift = Math.floor(scroll / SPACING)
    const frac = scroll - shift * SPACING
    const recolor = shift !== lastShift
    lastShift = shift
    for (let i = 0; i < RINGS; i++) {
      const sampleZ = -(i + shift) * SPACING // position in the static tunnel
      const localZ = -i * SPACING + frac
      const rad = R * (1 + Math.sin(sampleZ * 0.19) * 0.22 + Math.sin(t * 1.1) * 0.04)
      const roll = sampleZ * 0.055 + spin
      const accent = ((i + shift) % 7 + 7) % 7 === 0
      const c = accent ? cAccent : cSignal
      for (let s = 0; s < SEG; s++) {
        const a = (s / SEG) * Math.PI * 2 + roll
        const j = (i * SEG + s) * 3
        pos[j] = Math.cos(a) * rad
        pos[j + 1] = Math.sin(a) * rad
        pos[j + 2] = localZ
        if (recolor) {
          col[j] = c.r
          col[j + 1] = c.g
          col[j + 2] = c.b
        }
      }
    }
    posAttr.needsUpdate = true
    if (recolor) colAttr.needsUpdate = true
  }
  build(0)

  return {
    scene,
    camera,
    update(t) {
      build(t)
      camera.position.x = Math.sin(t * 0.31) * 0.5
      camera.position.y = Math.cos(t * 0.23) * 0.5
      camera.rotation.z = Math.sin(t * 0.17) * 0.12
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
