import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 1000

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 7, 16)
  const camera = new THREE.PerspectiveCamera(46, ctx.width / ctx.height, 0.1, 40)
  camera.position.set(0, 2.3, 8)
  camera.lookAt(0, 0, 0)

  const starGeo = new THREE.SphereGeometry(1, 24, 16)
  const primaryMat = new THREE.MeshBasicMaterial({ color: ctx.palette.signal })
  const donorMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent, wireframe: true })
  const primary = new THREE.Mesh(starGeo, primaryMat)
  const donor = new THREE.Mesh(starGeo, donorMat)
  primary.scale.setScalar(0.72)
  donor.scale.setScalar(0.46)
  scene.add(primary, donor)

  const progress = new Float32Array(COUNT)
  const wobble = new Float32Array(COUNT * 2)
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    progress[i] = ctx.random()
    wobble[i * 2] = ctx.random() * Math.PI * 2
    wobble[i * 2 + 1] = 0.45 + ctx.random() * 0.7
  }
  const streamGeo = new THREE.BufferGeometry()
  streamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const streamMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.045, transparent: true, opacity: 0.9, depthWrite: false,
  })
  scene.add(new THREE.Points(streamGeo, streamMat))

  return {
    scene,
    camera,
    update(t, _dt) {
      const orbit = t * 0.42
      const co = Math.cos(orbit)
      const so = Math.sin(orbit)
      primary.position.set(co * 1.05, 0, so * 1.05)
      donor.position.set(-co * 1.75, 0, -so * 1.75)
      primary.scale.setScalar(0.72 + Math.sin(t * 2.1) * 0.035)
      for (let i = 0; i < COUNT; i++) {
        const u = (progress[i] + t * 0.15 * wobble[i * 2 + 1]) % 1
        const lx = -1.75 + 2.8 * u
        const bend = Math.sin(Math.PI * u)
        const lz = bend * (0.72 * (u - 0.35))
        const ly = bend * Math.sin(wobble[i * 2] + u * 15) * 0.12
        const k = i * 3
        positions[k] = lx * co + lz * so
        positions[k + 1] = ly
        positions[k + 2] = lx * so - lz * co
      }
      streamGeo.attributes.position.needsUpdate = true
    },
    dispose() {
      starGeo.dispose()
      primaryMat.dispose()
      donorMat.dispose()
      streamGeo.dispose()
      streamMat.dispose()
    },
  }
}
