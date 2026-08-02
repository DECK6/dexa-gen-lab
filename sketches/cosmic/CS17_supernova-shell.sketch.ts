import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 3400

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 8, 17)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 40)
  camera.position.set(0, 0.7, 9)
  camera.lookAt(0, 0, 0)

  const direction = new Float32Array(COUNT * 4)
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const y = 2 * ctx.random() - 1
    const a = ctx.random() * Math.PI * 2
    const r = Math.sqrt(1 - y * y)
    direction[i * 4] = Math.cos(a) * r
    direction[i * 4 + 1] = y
    direction[i * 4 + 2] = Math.sin(a) * r
    direction[i * 4 + 3] = 0.82 + ctx.random() * 0.36
  }
  const shellGeo = new THREE.BufferGeometry()
  shellGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const shellMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.045, transparent: true, opacity: 0.9, depthWrite: false,
  })
  scene.add(new THREE.Points(shellGeo, shellMat))
  const coreGeo = new THREE.IcosahedronGeometry(0.5, 2)
  const coreMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent, transparent: true })
  const core = new THREE.Mesh(coreGeo, coreMat)
  scene.add(core)

  return {
    scene,
    camera,
    update(t, _dt) {
      const age = (0.18 + t * 0.1) % 1
      const expansion = 0.45 + 5.3 * (1 - Math.exp(-3 * age)) / (1 - Math.exp(-3))
      for (let i = 0; i < COUNT; i++) {
        const k4 = i * 4
        const radius = expansion * direction[k4 + 3]
        const k = i * 3
        positions[k] = direction[k4] * radius
        positions[k + 1] = direction[k4 + 1] * radius
        positions[k + 2] = direction[k4 + 2] * radius
      }
      shellGeo.attributes.position.needsUpdate = true
      shellMat.opacity = 0.2 + Math.sin(Math.PI * age) * 0.75
      coreMat.opacity = Math.max(0.08, 1 - age * 1.8)
      core.scale.setScalar(0.5 + age * 2.2)
      core.rotation.y = t * 0.7
    },
    dispose() {
      shellGeo.dispose()
      shellMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
    },
  }
}
