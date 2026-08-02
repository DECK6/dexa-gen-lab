import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const STEPS = 120
const PER_TURN = 24
const RISE = 0.17
const HEIGHT = STEPS * RISE

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 7, 24)
  const camera = new THREE.PerspectiveCamera(48, ctx.width / ctx.height, 0.1, 60)

  const geo = new THREE.BoxGeometry(1.7, 0.13, 0.56)
  const mat = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true })
  const stairs = new THREE.InstancedMesh(geo, mat, STEPS)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  for (let i = 0; i < STEPS; i++) stairs.setColorAt(i, i % PER_TURN === 0 ? accent : signal)
  scene.add(stairs)

  const axisGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -HEIGHT / 2, 0),
    new THREE.Vector3(0, HEIGHT / 2, 0),
  ])
  const axisMat = new THREE.LineBasicMaterial({ color: new THREE.Color(pal.dim) })
  scene.add(new THREE.Line(axisGeo, axisMat))
  const dummy = new THREE.Object3D()
  const phase = ctx.random() * Math.PI * 2

  function climb(t: number) {
    const travel = t * 0.95
    for (let i = 0; i < STEPS; i++) {
      const screw = i + travel / RISE
      const a = (screw / PER_TURN) * Math.PI * 2 + phase
      const y = ((i * RISE + travel) % HEIGHT) - HEIGHT / 2
      dummy.position.set(Math.cos(a) * 3.25, y, Math.sin(a) * 3.25)
      dummy.rotation.set(0, -a, Math.sin(a * 2) * 0.035)
      dummy.updateMatrix()
      stairs.setMatrixAt(i, dummy.matrix)
    }
    stairs.instanceMatrix.needsUpdate = true
  }
  climb(0)

  return {
    scene,
    camera,
    update(t) {
      climb(t)
      const a = t * 0.18 + phase * 0.2
      camera.position.set(Math.cos(a) * 11, 1.5 + Math.sin(t * 0.24) * 3, Math.sin(a) * 11)
      camera.lookAt(0, camera.position.y + 1.6, 0)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      axisGeo.dispose()
      axisMat.dispose()
    },
  }
}
