import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 1800

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 8, 18)
  const camera = new THREE.PerspectiveCamera(44, ctx.width / ctx.height, 0.1, 40)
  camera.position.set(7, 2.4, 8)
  camera.lookAt(0, 0, 0)

  const seeds = new Float32Array(COUNT * 4)
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    seeds[i * 4] = ctx.random()
    seeds[i * 4 + 1] = ctx.random() * Math.PI * 2
    seeds[i * 4 + 2] = i % 2 ? 1 : -1
    seeds[i * 4 + 3] = 0.12 + ctx.random() * 0.14
  }
  const jetGeo = new THREE.BufferGeometry()
  jetGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const jetMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.048, transparent: true, opacity: 0.76, depthWrite: false,
  })
  scene.add(new THREE.Points(jetGeo, jetMat))
  const coreGeo = new THREE.IcosahedronGeometry(0.55, 3)
  const coreMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const core = new THREE.Mesh(coreGeo, coreMat)
  scene.add(core)
  const haloGeo = new THREE.SphereGeometry(0.82, 22, 16)
  const haloMat = new THREE.MeshBasicMaterial({
    color: ctx.palette.signal, transparent: true, opacity: 0.25, wireframe: true,
  })
  const halo = new THREE.Mesh(haloGeo, haloMat)
  scene.add(halo)

  return {
    scene,
    camera,
    update(t, _dt) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.1 + Math.sin(t * 0.47) * 2)
      for (let i = 0; i < COUNT; i++) {
        const k4 = i * 4
        const u = (seeds[k4] + t * seeds[k4 + 3]) % 1
        const y = seeds[k4 + 2] * (0.55 + u * 5.2)
        const knot = 0.7 + 0.3 * Math.sin(u * 24 - t * 3.1)
        const radius = (0.08 + u * 1.18) * knot
        const a = seeds[k4 + 1] + u * 3.5
        const k = i * 3
        positions[k] = Math.cos(a) * radius
        positions[k + 1] = y
        positions[k + 2] = Math.sin(a) * radius
      }
      jetGeo.attributes.position.needsUpdate = true
      core.scale.setScalar(0.78 + pulse * 0.42)
      core.rotation.y = t * 0.9
      halo.scale.setScalar(0.9 + pulse * 0.8)
      haloMat.opacity = 0.12 + pulse * 0.3
    },
    dispose() {
      jetGeo.dispose()
      jetMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
      haloGeo.dispose()
      haloMat.dispose()
    },
  }
}
