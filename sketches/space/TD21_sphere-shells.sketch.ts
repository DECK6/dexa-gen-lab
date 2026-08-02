import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const SHELLS = 5
const PER_SHELL = 1800

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 7, 22)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 50)
  camera.position.set(0, 0, 13)

  const mat = new THREE.PointsMaterial({ size: 0.045, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.78 })
  const shells: THREE.Points[] = []
  const geos: THREE.BufferGeometry[] = []
  const rates = new Float32Array(SHELLS)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let s = 0; s < SHELLS; s++) {
    const pos = new Float32Array(PER_SHELL * 3)
    const col = new Float32Array(PER_SHELL * 3)
    const radius = 2.2 + s * 0.62
    for (let i = 0; i < PER_SHELL; i++) {
      const y = 1 - (2 * i + 1) / PER_SHELL
      const rr = Math.sqrt(Math.max(0, 1 - y * y))
      const a = i * golden + s * 0.37 + ctx.random() * 0.015
      const j = i * 3
      pos[j] = Math.cos(a) * rr * radius
      pos[j + 1] = y * radius
      pos[j + 2] = Math.sin(a) * rr * radius
      const c = i % 211 === 0 ? accent : signal
      col[j] = c.r
      col[j + 1] = c.g
      col[j + 2] = c.b
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const points = new THREE.Points(geo, mat)
    points.rotation.z = (s - 2) * 0.19
    scene.add(points)
    shells.push(points)
    geos.push(geo)
    rates[s] = (s % 2 === 0 ? 1 : -1) * (0.11 + s * 0.035)
  }

  return {
    scene,
    camera,
    update(t) {
      for (let s = 0; s < SHELLS; s++) {
        shells[s]!.rotation.y = t * rates[s]!
        shells[s]!.rotation.x = Math.sin(t * rates[s]! * 0.7 + s) * 0.24
      }
      camera.position.x = Math.sin(t * 0.08) * 2.2
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      for (const geo of geos) geo.dispose()
      mat.dispose()
    },
  }
}
