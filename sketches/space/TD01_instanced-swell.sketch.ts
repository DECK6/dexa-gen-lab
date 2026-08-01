import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const GRID = 24
const GAP = 1.1

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 28, 60)

  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 100)

  const geo = new THREE.BoxGeometry(0.7, 1, 0.7)
  const mat = new THREE.MeshBasicMaterial({ wireframe: true })
  const count = GRID * GRID
  const mesh = new THREE.InstancedMesh(geo, mat, count)

  const cSignal = new THREE.Color(pal.signal)
  const cAccent = new THREE.Color(pal.accent)
  const phases: number[] = []
  for (let i = 0; i < count; i++) {
    phases.push(ctx.random() * Math.PI * 2)
    mesh.setColorAt(i, ctx.random() < 0.04 ? cAccent : cSignal)
  }
  scene.add(mesh)

  const dummy = new THREE.Object3D()
  function layout(t: number) {
    let i = 0
    for (let gx = 0; gx < GRID; gx++) {
      for (let gz = 0; gz < GRID; gz++) {
        const x = (gx - GRID / 2 + 0.5) * GAP
        const z = (gz - GRID / 2 + 0.5) * GAP
        const d = Math.hypot(x, z)
        const h = 1 + (Math.sin(d * 0.7 - t * 1.6 + phases[i]! * 0.15) + 1) * 2.2
        dummy.position.set(x, h / 2, z)
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
      const r = 26
      camera.position.set(Math.cos(t * 0.12) * r, 15, Math.sin(t * 0.12) * r)
      camera.lookAt(0, 2, 0)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
