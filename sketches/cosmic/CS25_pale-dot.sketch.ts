import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 4200

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 9, 34)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 60)

  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const radius = 3 + Math.pow(ctx.random(), 0.45) * 14
    const angle = ctx.random() * Math.PI * 2
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = Math.sin(angle) * radius
    positions[i * 3 + 2] = (ctx.random() - 0.5) * 34
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const dustMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.04, transparent: true, opacity: 0.62, depthWrite: false,
  })
  const dust = new THREE.Points(dustGeo, dustMat)
  scene.add(dust)
  const dotGeo = new THREE.SphereGeometry(0.18, 16, 12)
  const dotMat = new THREE.MeshBasicMaterial({ color: ctx.palette.paper })
  const dot = new THREE.Mesh(dotGeo, dotMat)
  scene.add(dot)
  const reticleGeo = new THREE.TorusGeometry(0.5, 0.012, 6, 48)
  const reticleMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent, transparent: true, opacity: 0.7 })
  const reticle = new THREE.Mesh(reticleGeo, reticleMat)
  scene.add(reticle)

  return {
    scene,
    camera,
    update(t, _dt) {
      const retreat = (0.05 + t * 0.08) % 1
      camera.position.set(0, 0, 5 + retreat * 15)
      camera.lookAt(0, 0, 0)
      dust.rotation.z = t * 0.012
      dot.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06)
      reticle.rotation.z = -t * 0.08
      reticleMat.opacity = 0.35 + Math.sin(t * 0.9) * 0.2
    },
    dispose() {
      dustGeo.dispose()
      dustMat.dispose()
      dotGeo.dispose()
      dotMat.dispose()
      reticleGeo.dispose()
      reticleMat.dispose()
    },
  }
}
