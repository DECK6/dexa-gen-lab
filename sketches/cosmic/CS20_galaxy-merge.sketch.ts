import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 3600

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 9, 20)
  const camera = new THREE.PerspectiveCamera(47, ctx.width / ctx.height, 0.1, 45)
  camera.position.set(0, 5.2, 10)
  camera.lookAt(0, 0, 0)

  const seeds = new Float32Array(COUNT * 4)
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const side = i % 2 ? 1 : -1
    const r = Math.pow(ctx.random(), 0.7) * 2.6
    const arm = i % 4 < 2 ? 0 : Math.PI
    seeds[i * 4] = side
    seeds[i * 4 + 1] = r
    seeds[i * 4 + 2] = r * 1.8 + arm + (ctx.random() - 0.5) * 0.65
    seeds[i * 4 + 3] = (ctx.random() - 0.5) * (0.18 + r * 0.05)
  }
  const starsGeo = new THREE.BufferGeometry()
  starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const starsMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.035, transparent: true, opacity: 0.82, depthWrite: false,
  })
  scene.add(new THREE.Points(starsGeo, starsMat))
  const coreGeo = new THREE.OctahedronGeometry(0.22, 1)
  const coreMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const cores = [new THREE.Mesh(coreGeo, coreMat), new THREE.Mesh(coreGeo, coreMat)]
  scene.add(...cores)

  return {
    scene,
    camera,
    update(t, _dt) {
      const distance = 1.05 + 2.35 * (0.5 + 0.5 * Math.cos(t * 0.24))
      const dance = t * 0.12
      const cd = Math.cos(dance)
      const sd = Math.sin(dance)
      for (let i = 0; i < COUNT; i++) {
        const k4 = i * 4
        const side = seeds[k4]
        const r = seeds[k4 + 1]
        const a = seeds[k4 + 2] + side * t * 0.34 / (0.45 + r)
        const stretch = 1 + (3.4 - distance) * r * 0.09
        const lx = (side * distance + Math.cos(a) * r * stretch)
        const lz = Math.sin(a) * r
        const k = i * 3
        positions[k] = lx * cd + lz * sd
        positions[k + 1] = seeds[k4 + 3] + side * lz * 0.14
        positions[k + 2] = -lx * sd + lz * cd
      }
      for (let i = 0; i < 2; i++) {
        const side = i ? 1 : -1
        cores[i].position.set(side * distance * cd, 0, -side * distance * sd)
        cores[i].rotation.y = side * t
      }
      starsGeo.attributes.position.needsUpdate = true
    },
    dispose() {
      starsGeo.dispose()
      starsMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
    },
  }
}
