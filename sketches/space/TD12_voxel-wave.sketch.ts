import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const SIDE = 13
const GAP = 0.68
const COUNT = SIDE * SIDE * SIDE

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 9, 25)
  const camera = new THREE.PerspectiveCamera(47, ctx.width / ctx.height, 0.1, 60)

  const geo = new THREE.BoxGeometry(0.42, 0.42, 0.42)
  const mat = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true })
  const mesh = new THREE.InstancedMesh(geo, mat, COUNT)
  const base = new Float32Array(COUNT * 3)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  let n = 0
  for (let z = 0; z < SIDE; z++) {
    for (let y = 0; y < SIDE; y++) {
      for (let x = 0; x < SIDE; x++) {
        const j = n * 3
        base[j] = (x - (SIDE - 1) / 2) * GAP
        base[j + 1] = (y - (SIDE - 1) / 2) * GAP
        base[j + 2] = (z - (SIDE - 1) / 2) * GAP
        mesh.setColorAt(n, ctx.random() < 0.025 ? accent : signal)
        n++
      }
    }
  }
  scene.add(mesh)
  const dummy = new THREE.Object3D()
  const offset = ctx.random() * 8

  function wave(t: number) {
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3
      const x = base[j]!
      const y = base[j + 1]!
      const z = base[j + 2]!
      const q = x * 0.58 + y * 0.76 - z * 0.31 + t * 2.7 + offset
      const wrapped = ((q + 4) % 8 + 8) % 8 - 4
      const density = Math.exp(-wrapped * wrapped * 1.25)
      const scale = 0.06 + density * (0.72 + Math.sin(q * 2.1) * 0.12)
      dummy.position.set(x, y, z)
      dummy.scale.setScalar(scale)
      dummy.rotation.set(q * 0.05, q * 0.08, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }
  wave(0)

  return {
    scene,
    camera,
    update(t) {
      wave(t)
      const r = 15
      camera.position.set(Math.cos(t * 0.13) * r, 7 + Math.sin(t * 0.19), Math.sin(t * 0.13) * r)
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
