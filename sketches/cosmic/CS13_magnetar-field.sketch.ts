import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const LINES = 54
const SEGMENTS = 42

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 8, 19)
  const camera = new THREE.PerspectiveCamera(44, ctx.width / ctx.height, 0.1, 40)
  camera.position.set(0, 1.4, 9)
  camera.lookAt(0, 0, 0)

  const shell = new Float32Array(LINES)
  const phase = new Float32Array(LINES)
  for (let i = 0; i < LINES; i++) {
    shell[i] = 2.2 + ctx.random() * 2.4
    phase[i] = ctx.random() * Math.PI * 2
  }
  const positions = new Float32Array(LINES * SEGMENTS * 6)
  const fieldGeo = new THREE.BufferGeometry()
  fieldGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const fieldMat = new THREE.LineBasicMaterial({
    color: ctx.palette.signal, transparent: true, opacity: 0.68,
  })
  scene.add(new THREE.LineSegments(fieldGeo, fieldMat))
  const coreGeo = new THREE.IcosahedronGeometry(0.62, 2)
  const coreMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent, wireframe: true })
  const core = new THREE.Mesh(coreGeo, coreMat)
  scene.add(core)

  return {
    scene,
    camera,
    update(t, _dt) {
      let p = 0
      for (let line = 0; line < LINES; line++) {
        for (let seg = 0; seg < SEGMENTS; seg++) {
          for (let end = 0; end < 2; end++) {
            const theta = 0.18 + (seg + end) / SEGMENTS * (Math.PI - 0.36)
            const st = Math.sin(theta)
            const r = shell[line] * st * st
            const twist = Math.sin(theta * 5 - t * 2.4 + phase[line]) * (0.18 + 0.3 * st)
            const phi = phase[line] + twist
            positions[p++] = r * st * Math.cos(phi)
            positions[p++] = r * Math.cos(theta)
            positions[p++] = r * st * Math.sin(phi)
          }
        }
      }
      fieldGeo.attributes.position.needsUpdate = true
      core.rotation.y = t * 0.8
      core.rotation.z = Math.sin(t * 1.7) * 0.25
      core.scale.setScalar(1 + Math.sin(t * 4.2) * 0.08)
    },
    dispose() {
      fieldGeo.dispose()
      fieldMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
    },
  }
}
