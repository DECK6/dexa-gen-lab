import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 2600

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 8, 18)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 40)
  camera.position.set(0, 5.4, 8)
  camera.lookAt(0, 0, 0)

  const seeds = new Float32Array(COUNT * 5)
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    seeds[i * 5] = i % 2 ? 1 : -1
    seeds[i * 5 + 1] = (ctx.random() - 0.5) * 0.55
    seeds[i * 5 + 2] = 0.04 + ctx.random() * 0.18
    seeds[i * 5 + 3] = ctx.random() * Math.PI * 2
    seeds[i * 5 + 4] = (ctx.random() - 0.5) * 0.35
  }
  const trojanGeo = new THREE.BufferGeometry()
  trojanGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const trojanMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.04, transparent: true, opacity: 0.78, depthWrite: false,
  })
  scene.add(new THREE.Points(trojanGeo, trojanMat))
  const starGeo = new THREE.SphereGeometry(0.55, 20, 14)
  const starMat = new THREE.MeshBasicMaterial({ color: ctx.palette.signal })
  scene.add(new THREE.Mesh(starGeo, starMat))
  const planetGeo = new THREE.SphereGeometry(0.2, 14, 10)
  const planetMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const planet = new THREE.Mesh(planetGeo, planetMat)
  scene.add(planet)

  return {
    scene,
    camera,
    update(t, _dt) {
      const orbit = t * 0.28
      planet.position.set(Math.cos(orbit) * 3, 0, Math.sin(orbit) * 3)
      for (let i = 0; i < COUNT; i++) {
        const k5 = i * 5
        const side = seeds[k5]
        const libration = Math.sin(t * (0.32 + seeds[k5 + 2]) + seeds[k5 + 3]) * seeds[k5 + 2]
        const angle = orbit + side * Math.PI / 3 + seeds[k5 + 1] + libration
        const radius = 3 + Math.cos(t * 0.41 + seeds[k5 + 3]) * seeds[k5 + 1] * 0.5
        const k = i * 3
        positions[k] = Math.cos(angle) * radius
        positions[k + 1] = seeds[k5 + 4] + Math.sin(t * 0.55 + seeds[k5 + 3]) * 0.08
        positions[k + 2] = Math.sin(angle) * radius
      }
      trojanGeo.attributes.position.needsUpdate = true
    },
    dispose() {
      trojanGeo.dispose()
      trojanMat.dispose()
      starGeo.dispose()
      starMat.dispose()
      planetGeo.dispose()
      planetMat.dispose()
    },
  }
}
