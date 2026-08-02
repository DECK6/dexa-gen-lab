import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const SIDE = 13
const GAP = 1.45
const COUNT = SIDE * SIDE

function smoothstep(x: number): number {
  const v = Math.min(1, Math.max(0, x))
  return v * v * (3 - 2 * v)
}

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 12, 38)
  const camera = new THREE.PerspectiveCamera(48, ctx.width / ctx.height, 0.1, 90)

  const geo = new THREE.BoxGeometry(0.18, 2.8, 0.95)
  const mat = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true })
  const mesh = new THREE.InstancedMesh(geo, mat, COUNT)
  const phase = new Float32Array(COUNT)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  for (let i = 0; i < COUNT; i++) {
    phase[i] = ctx.random() * 0.45
    mesh.setColorAt(i, i % 29 === 0 ? accent : signal)
  }
  scene.add(mesh)
  const grid = new THREE.GridHelper(SIDE * GAP, SIDE, new THREE.Color(pal.dim), new THREE.Color(pal.dim))
  scene.add(grid)
  const dummy = new THREE.Object3D()

  function align(t: number) {
    let i = 0
    for (let z = 0; z < SIDE; z++) {
      for (let x = 0; x < SIDE; x++) {
        const px = (x - (SIDE - 1) / 2) * GAP
        const pz = (z - (SIDE - 1) / 2) * GAP
        const wave = Math.sin(t * 1.15 - Math.hypot(px, pz) * 0.72 + phase[i]!)
        const turn = smoothstep((wave + 0.35) / 0.7)
        const radial = Math.atan2(pz, px)
        dummy.position.set(px, 1.4, pz)
        dummy.rotation.set(Math.sin(t * 0.7 + phase[i]!) * 0.08 * (1 - turn), radial * (1 - turn) + Math.PI * 0.5 * turn, 0)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        i++
      }
    }
    mesh.instanceMatrix.needsUpdate = true
  }
  align(0)

  return {
    scene,
    camera,
    update(t) {
      align(t)
      camera.position.set(Math.cos(t * 0.11) * 19, 8, Math.sin(t * 0.11) * 19)
      camera.lookAt(0, 1.2, 0)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      grid.geometry.dispose()
      ;(grid.material as THREE.Material).dispose()
    },
  }
}
