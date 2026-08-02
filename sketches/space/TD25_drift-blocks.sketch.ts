import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const SIDE = 5
const COUNT = SIDE * SIDE * SIDE

function smoothstep(x: number): number {
  const v = Math.min(1, Math.max(0, x))
  return v * v * (3 - 2 * v)
}

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 10, 28)
  const camera = new THREE.PerspectiveCamera(48, ctx.width / ctx.height, 0.1, 70)

  const geo = new THREE.BoxGeometry(0.68, 0.68, 0.68)
  const mat = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true })
  const blocks = new THREE.InstancedMesh(geo, mat, COUNT)
  const data = new Float32Array(COUNT * 8)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  for (let i = 0; i < COUNT; i++) {
    const k = i * 8
    data[k] = (i % SIDE - 2) * 0.82
    data[k + 1] = (Math.floor(i / SIDE) % SIDE - 2) * 0.82
    data[k + 2] = (Math.floor(i / (SIDE * SIDE)) - 2) * 0.82
    const a = ctx.random() * Math.PI * 2
    const r = 4.5 + ctx.random() * 5
    data[k + 3] = Math.cos(a) * r
    data[k + 4] = (ctx.random() - 0.5) * 10
    data[k + 5] = Math.sin(a) * r
    data[k + 6] = 0.22 + ctx.random() * 0.45
    data[k + 7] = ctx.random() * 0.34
    blocks.setColorAt(i, i % 31 === 0 ? accent : signal)
  }
  scene.add(blocks)
  const dummy = new THREE.Object3D()

  function dock(t: number) {
    const cycle = (t / 12 + 0.2) % 1
    const gate = smoothstep((cycle - 0.08) / 0.18) * (1 - smoothstep((cycle - 0.65) / 0.22))
    for (let i = 0; i < COUNT; i++) {
      const k = i * 8
      const mix = smoothstep((gate - data[k + 7]!) / 0.45)
      const a = t * data[k + 6]! + i * 0.17
      const dx = data[k + 3]! + Math.sin(a * 0.7) * 1.2
      const dy = data[k + 4]! + Math.cos(a * 0.9) * 0.8
      const dz = data[k + 5]! + Math.sin(a) * 1.2
      dummy.position.set(
        dx + (data[k]! - dx) * mix,
        dy + (data[k + 1]! - dy) * mix,
        dz + (data[k + 2]! - dz) * mix,
      )
      dummy.rotation.set(a * (1 - mix), a * 1.3 * (1 - mix), a * 0.7 * (1 - mix))
      dummy.updateMatrix()
      blocks.setMatrixAt(i, dummy.matrix)
    }
    blocks.instanceMatrix.needsUpdate = true
  }
  dock(0)

  return {
    scene,
    camera,
    update(t) {
      dock(t)
      blocks.rotation.y = t * 0.1
      blocks.rotation.x = Math.sin(t * 0.08) * 0.22
      camera.position.set(Math.cos(t * 0.07) * 14, 6, Math.sin(t * 0.07) * 14)
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
