import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 14000
const R = 4.4

// Smooth pseudo-noise (2 octaves of folded sines) — deterministic, no PRNG per frame.
function wobble(x: number, y: number, z: number): number {
  let v = 0
  let a = 1
  let f = 1
  for (let o = 0; o < 2; o++) {
    v += a * Math.sin(x * f + Math.cos(y * f * 1.3)) * Math.cos(z * f * 1.1 - Math.sin(x * f * 0.7))
    a *= 0.5
    f *= 2.3
  }
  return v
}

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 8, 24)

  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 60)
  camera.position.set(0, 0, 13)

  const dir = new Float32Array(COUNT * 3)
  const pos = new Float32Array(COUNT * 3)
  const col = new Float32Array(COUNT * 3)
  const cSignal = new THREE.Color(pal.signal)
  const cAccent = new THREE.Color(pal.accent)
  const golden = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (2 * i + 1) / COUNT
    const rr = Math.sqrt(Math.max(0, 1 - y * y))
    const th = golden * i + ctx.random() * 0.03
    const j = i * 3
    dir[j] = Math.cos(th) * rr
    dir[j + 1] = y
    dir[j + 2] = Math.sin(th) * rr
    pos[j] = dir[j] * R
    pos[j + 1] = dir[j + 1] * R
    pos[j + 2] = dir[j + 2] * R
    const c = ctx.random() < 0.045 ? cAccent : cSignal
    col[j] = c.r
    col[j + 1] = c.g
    col[j + 2] = c.b
  }

  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('position', posAttr)
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, sizeAttenuation: true })
  const points = new THREE.Points(geo, mat)
  scene.add(points)

  return {
    scene,
    camera,
    update(t) {
      // 0 = perfect sphere, 1 = fully distorted
      const amp = (1 - Math.cos(t * 0.42)) * 0.5
      for (let i = 0; i < COUNT; i++) {
        const j = i * 3
        const dx = dir[j]
        const dy = dir[j + 1]
        const dz = dir[j + 2]
        const n = wobble(dx * 2.4 + t * 0.25, dy * 2.4, dz * 2.4 - t * 0.18)
        const rad = R + amp * n * 2.2
        pos[j] = dx * rad
        pos[j + 1] = dy * rad
        pos[j + 2] = dz * rad
      }
      posAttr.needsUpdate = true
      points.rotation.y = t * 0.13
      points.rotation.x = Math.sin(t * 0.17) * 0.3
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
