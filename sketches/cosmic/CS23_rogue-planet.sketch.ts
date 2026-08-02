import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 2400

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 5, 21)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 40)
  camera.position.set(0, 0, 8)
  camera.lookAt(0, 0, 0)

  const seeds = new Float32Array(COUNT * 4)
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    seeds[i * 4] = (ctx.random() - 0.5) * 15
    seeds[i * 4 + 1] = (ctx.random() - 0.5) * 11
    seeds[i * 4 + 2] = ctx.random() * 18
    seeds[i * 4 + 3] = 0.35 + ctx.random() * 0.8
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const dustMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.035, transparent: true, opacity: 0.7, depthWrite: false,
  })
  scene.add(new THREE.Points(dustGeo, dustMat))
  const planetGeo = new THREE.IcosahedronGeometry(1.18, 4)
  const planetMat = new THREE.MeshBasicMaterial({ color: ctx.palette.ink })
  const wireMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent, wireframe: true, transparent: true, opacity: 0.5 })
  const planet = new THREE.Group()
  planet.add(new THREE.Mesh(planetGeo, planetMat), new THREE.Mesh(planetGeo, wireMat))
  scene.add(planet)

  return {
    scene,
    camera,
    update(t, _dt) {
      for (let i = 0; i < COUNT; i++) {
        const k4 = i * 4
        const k = i * 3
        positions[k] = seeds[k4]
        positions[k + 1] = seeds[k4 + 1]
        positions[k + 2] = 7 - ((seeds[k4 + 2] + t * seeds[k4 + 3]) % 18)
      }
      dustGeo.attributes.position.needsUpdate = true
      const drift = ((t * 0.08 + 0.15) % 1) * 2.8 - 1.4
      planet.position.set(drift, 0.3 - drift * 0.18, 0)
      planet.rotation.y = t * 0.17
      planet.rotation.z = t * 0.05
    },
    dispose() {
      dustGeo.dispose()
      dustMat.dispose()
      planetGeo.dispose()
      planetMat.dispose()
      wireMat.dispose()
    },
  }
}
