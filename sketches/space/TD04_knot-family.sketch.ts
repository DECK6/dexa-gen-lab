import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const N = 1600
const BEADS = 3
const DWELL = 6 // seconds per (p,q) pair, last 40% spent morphing to the next
const PAIRS: number[][] = [
  [2, 3],
  [3, 2],
  [3, 4],
  [4, 3],
  [5, 2],
  [2, 5],
  [3, 5],
  [5, 3],
]

function smoothstep(x: number): number {
  const k = Math.min(1, Math.max(0, x))
  return k * k * (3 - 2 * k)
}

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 6, 22)

  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 60)
  camera.position.set(0, 0, 12)

  const start = Math.floor(ctx.random() * PAIRS.length)

  const pos = new Float32Array(N * 3)
  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('position', posAttr)
  const mat = new THREE.LineBasicMaterial({ color: new THREE.Color(pal.signal) })
  const line = new THREE.Line(geo, mat)

  const beadPos = new Float32Array(BEADS * 3)
  const beadGeo = new THREE.BufferGeometry()
  const beadAttr = new THREE.BufferAttribute(beadPos, 3)
  beadAttr.setUsage(THREE.DynamicDrawUsage)
  beadGeo.setAttribute('position', beadAttr)
  const beadMat = new THREE.PointsMaterial({
    color: new THREE.Color(pal.accent),
    size: 0.34,
    sizeAttenuation: true,
  })
  const beads = new THREE.Points(beadGeo, beadMat)

  const group = new THREE.Group()
  group.add(line, beads)
  scene.add(group)

  // torus knot curve: r = 2 + cos(q u) around a p-fold winding
  function curve(u: number, p: number, q: number, out: Float32Array, at: number) {
    const r = 2 + Math.cos(q * u)
    out[at] = r * Math.cos(p * u)
    out[at + 1] = r * Math.sin(p * u)
    out[at + 2] = Math.sin(q * u) * 1.6
  }

  function build(t: number) {
    const step = t / DWELL
    const i0 = (start + Math.floor(step)) % PAIRS.length
    const i1 = (i0 + 1) % PAIRS.length
    const m = smoothstep((step - Math.floor(step) - 0.6) / 0.4)
    const a = PAIRS[i0]!
    const b = PAIRS[i1]!
    const p = a[0]! + (b[0]! - a[0]!) * m
    const q = a[1]! + (b[1]! - a[1]!) * m
    for (let i = 0; i < N; i++) {
      curve((i / (N - 1)) * Math.PI * 2, p, q, pos, i * 3)
    }
    posAttr.needsUpdate = true
    for (let i = 0; i < BEADS; i++) {
      const u = ((t * 0.11 + i / BEADS) % 1) * Math.PI * 2
      curve(u, p, q, beadPos, i * 3)
    }
    beadAttr.needsUpdate = true
  }
  build(0)

  return {
    scene,
    camera,
    update(t) {
      build(t)
      group.rotation.y = t * 0.35
      group.rotation.x = Math.sin(t * 0.23) * 0.5
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      beadGeo.dispose()
      beadMat.dispose()
    },
  }
}
