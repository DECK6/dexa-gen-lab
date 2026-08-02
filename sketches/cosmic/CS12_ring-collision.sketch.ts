import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 2600

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 8, 17)
  const camera = new THREE.PerspectiveCamera(46, ctx.width / ctx.height, 0.1, 40)
  camera.position.set(0, 5.8, 7.5)
  camera.lookAt(0, 0, 0)

  const base = new Float32Array(COUNT * 2)
  const lift = new Float32Array(COUNT)
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const r = Math.sqrt(ctx.random()) * 4.2
    const a = ctx.random() * Math.PI * 2
    base[i * 2] = Math.cos(a) * r
    base[i * 2 + 1] = Math.sin(a) * r
    lift[i] = ctx.random() - 0.5
  }
  const starsGeo = new THREE.BufferGeometry()
  starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const starsMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.035, transparent: true, opacity: 0.82, depthWrite: false,
  })
  scene.add(new THREE.Points(starsGeo, starsMat))
  const ringGeo = new THREE.RingGeometry(0.97, 1, 96)
  const ringMat = new THREE.MeshBasicMaterial({
    color: ctx.palette.accent, side: THREE.DoubleSide, transparent: true, opacity: 0.72,
  })
  const rings = [new THREE.Mesh(ringGeo, ringMat), new THREE.Mesh(ringGeo, ringMat)]
  rings[0].rotation.x = rings[1].rotation.x = -Math.PI / 2
  rings[0].position.x = -0.85
  rings[1].position.x = 0.85
  scene.add(...rings)

  return {
    scene,
    camera,
    update(t, _dt) {
      const wave0 = 0.45 + ((t * 0.28 + 0.16) % 1) * 4.3
      const wave1 = 0.45 + ((t * 0.28 + 0.66) % 1) * 4.3
      rings[0].scale.setScalar(wave0)
      rings[1].scale.setScalar(wave1)
      for (let i = 0; i < COUNT; i++) {
        let x = base[i * 2]
        let z = base[i * 2 + 1]
        let y = lift[i] * 0.18
        for (let w = 0; w < 2; w++) {
          const dx = x - (w ? 0.85 : -0.85)
          const d = Math.sqrt(dx * dx + z * z) + 0.001
          const impulse = Math.exp(-Math.pow(d - (w ? wave1 : wave0), 2) * 18) * 0.34
          x += dx / d * impulse
          z += z / d * impulse
          y += impulse * (w ? -0.5 : 0.5)
        }
        const k = i * 3
        positions[k] = x
        positions[k + 1] = y
        positions[k + 2] = z
      }
      starsGeo.attributes.position.needsUpdate = true
    },
    dispose() {
      starsGeo.dispose()
      starsMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
    },
  }
}
