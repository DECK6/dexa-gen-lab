import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 5, 25)
  const camera = new THREE.PerspectiveCamera(55, ctx.width / ctx.height, 0.1, 60)

  const pos: number[] = []
  const col: number[] = []
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  function grow(x: number, y: number, z: number, dx: number, dy: number, dz: number, len: number, depth: number, spin: number) {
    const ex = x + dx * len
    const ey = y + dy * len
    const ez = z + dz * len
    pos.push(x, y, z, ex, ey, ez)
    const c = depth === 0 && Math.sin(spin * 7) > 0.72 ? accent : signal
    col.push(c.r, c.g, c.b, c.r, c.g, c.b)
    if (depth === 0) return
    for (let side = -1; side <= 1; side += 2) {
      const a = spin + side * (0.58 + depth * 0.12)
      let nx = dx * 0.34 + Math.cos(a) * 0.52
      let ny = dy * 0.52 + 0.72
      let nz = dz * 0.34 + Math.sin(a) * 0.52
      const mag = Math.hypot(nx, ny, nz)
      nx /= mag
      ny /= mag
      nz /= mag
      grow(ex, ey, ez, nx, ny, nz, len * 0.7, depth - 1, spin + side * 1.17)
    }
  }
  for (let gz = 0; gz < 11; gz++) {
    for (let gx = 0; gx < 11; gx++) {
      const x = (gx - 5) * 3.25 + (ctx.random() - 0.5)
      const z = (gz - 5) * 4.1 + (ctx.random() - 0.5)
      grow(x, -1.8, z, 0, 1, 0, 1.4 + ctx.random() * 0.8, 4, ctx.random() * Math.PI * 2)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  const mat = new THREE.LineBasicMaterial({ vertexColors: true })
  scene.add(new THREE.LineSegments(geo, mat))

  return {
    scene,
    camera,
    update(t) {
      const a = t * 0.16
      const next = a + 0.2
      camera.position.set(Math.sin(a) * 10, 2.1 + Math.sin(t * 0.37) * 0.7, Math.cos(a) * 19)
      camera.lookAt(Math.sin(next) * 10, 2.5, Math.cos(next) * 19)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
