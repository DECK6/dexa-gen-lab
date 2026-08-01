import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const GRID = 16
const GAP = 1.3
const SPAN = GRID * GAP

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 16, 52)

  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 120)

  const ground = new THREE.GridHelper(SPAN, GRID, new THREE.Color(pal.dim), new THREE.Color(pal.dim))
  scene.add(ground)

  const geo = new THREE.BoxGeometry(0.82, 1, 0.82)
  const mat = new THREE.MeshBasicMaterial({ wireframe: true })
  const count = GRID * GRID
  const mesh = new THREE.InstancedMesh(geo, mat, count)
  scene.add(mesh)

  const cSignal = new THREE.Color(pal.signal)
  const cAccent = new THREE.Color(pal.accent)
  const phase = new Float32Array(count)
  const rate = new Float32Array(count)
  const peak = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    phase[i] = ctx.random()
    rate[i] = 0.045 + ctx.random() * 0.09
    peak[i] = 0.8 + ctx.random() * ctx.random() * 6.5
    mesh.setColorAt(i, ctx.random() < 0.06 ? cAccent : cSignal)
  }

  const dummy = new THREE.Object3D()
  function layout(t: number) {
    let i = 0
    for (let gx = 0; gx < GRID; gx++) {
      for (let gz = 0; gz < GRID; gz++) {
        const u = (t * rate[i]! + phase[i]!) % 1
        // slow growth, quick collapse
        const g = u < 0.74 ? (1 - Math.cos((u / 0.74) * Math.PI)) * 0.5 : Math.pow(1 - (u - 0.74) / 0.26, 3)
        const h = 0.05 + peak[i]! * g
        dummy.position.set((gx - GRID / 2 + 0.5) * GAP, h / 2, (gz - GRID / 2 + 0.5) * GAP)
        dummy.scale.set(1, h, 1)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        i++
      }
    }
    mesh.instanceMatrix.needsUpdate = true
  }
  layout(0)

  return {
    scene,
    camera,
    update(t) {
      layout(t)
      const r = 22
      camera.position.set(Math.cos(t * 0.09) * r, 6.5 + Math.sin(t * 0.07) * 3, Math.sin(t * 0.09) * r)
      camera.lookAt(0, 2.2, 0)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      ground.geometry.dispose()
      ;(ground.material as THREE.Material).dispose()
    },
  }
}
