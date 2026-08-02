import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 2800

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 8, 18)
  const camera = new THREE.PerspectiveCamera(46, ctx.width / ctx.height, 0.1, 40)
  camera.position.set(0, 5, 8)
  camera.lookAt(0, 0, 0)

  const seeds = new Float32Array(COUNT * 5)
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    seeds[i * 5] = ctx.random()
    seeds[i * 5 + 1] = i % 2 ? 1 : -1
    seeds[i * 5 + 2] = Math.pow(ctx.random(), 2) * 0.65
    seeds[i * 5 + 3] = ctx.random() * Math.PI * 2
    seeds[i * 5 + 4] = ctx.random() - 0.5
  }
  const streamGeo = new THREE.BufferGeometry()
  streamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const streamMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.035, transparent: true, opacity: 0.82, depthWrite: false,
  })
  scene.add(new THREE.Points(streamGeo, streamMat))
  const hostGeo = new THREE.IcosahedronGeometry(0.72, 1)
  const hostMat = new THREE.MeshBasicMaterial({ color: ctx.palette.dim, wireframe: true })
  scene.add(new THREE.Mesh(hostGeo, hostMat))
  const coreGeo = new THREE.SphereGeometry(0.18, 14, 10)
  const coreMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const core = new THREE.Mesh(coreGeo, coreMat)
  scene.add(core)

  return {
    scene,
    camera,
    update(t, _dt) {
      const orbit = t * 0.24
      core.position.set(Math.cos(orbit) * 2.3, 0, Math.sin(orbit) * 2.3)
      for (let i = 0; i < COUNT; i++) {
        const k5 = i * 5
        const u = (seeds[k5] + t * 0.045) % 1
        const escaped = Math.max(0, (u - 0.12) / 0.88)
        const side = seeds[k5 + 1]
        const angle = orbit + side * escaped * 2.9 + seeds[k5 + 3] * 0.045 * (1 - escaped)
        const radius = 2.3 + side * escaped * 0.75 + Math.cos(seeds[k5 + 3]) * seeds[k5 + 2] * (1 - escaped)
        const k = i * 3
        positions[k] = Math.cos(angle) * radius
        positions[k + 1] = seeds[k5 + 4] * 0.5 * (1 - escaped) + Math.sin(escaped * Math.PI) * side * 0.18
        positions[k + 2] = Math.sin(angle) * radius
      }
      streamGeo.attributes.position.needsUpdate = true
    },
    dispose() {
      streamGeo.dispose()
      streamMat.dispose()
      hostGeo.dispose()
      hostMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
    },
  }
}
