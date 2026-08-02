import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 260

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 8, 19)
  const camera = new THREE.PerspectiveCamera(43, ctx.width / ctx.height, 0.1, 35)
  camera.position.set(0, 0, 9)
  camera.lookAt(0, 0, 0)

  const radiantX = -1.55
  const radiantY = 1.15
  const seeds = new Float32Array(COUNT * 5)
  const positions = new Float32Array(COUNT * 6)
  for (let i = 0; i < COUNT; i++) {
    const a = ctx.random() * Math.PI * 2
    seeds[i * 5] = ctx.random()
    seeds[i * 5 + 1] = Math.cos(a)
    seeds[i * 5 + 2] = Math.sin(a)
    seeds[i * 5 + 3] = (ctx.random() - 0.5) * 0.42
    seeds[i * 5 + 4] = 0.16 + ctx.random() * 0.28
  }
  const streakGeo = new THREE.BufferGeometry()
  streakGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const streakMat = new THREE.LineBasicMaterial({
    color: ctx.palette.signal, transparent: true, opacity: 0.82,
  })
  scene.add(new THREE.LineSegments(streakGeo, streakMat))
  const radiantGeo = new THREE.TorusGeometry(0.14, 0.025, 8, 32)
  const radiantMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const radiant = new THREE.Mesh(radiantGeo, radiantMat)
  radiant.position.set(radiantX, radiantY, 0)
  scene.add(radiant)

  return {
    scene,
    camera,
    update(t, _dt) {
      for (let i = 0; i < COUNT; i++) {
        const k5 = i * 5
        const u = (seeds[k5] + t * seeds[k5 + 4]) % 1
        const distance = 0.2 + u * 6.4
        const length = 0.18 + u * 0.72
        const dx = seeds[k5 + 1]
        const dy = seeds[k5 + 2]
        const k = i * 6
        positions[k] = radiantX + dx * (distance - length)
        positions[k + 1] = radiantY + dy * (distance - length)
        positions[k + 2] = seeds[k5 + 3]
        positions[k + 3] = radiantX + dx * distance
        positions[k + 4] = radiantY + dy * distance
        positions[k + 5] = seeds[k5 + 3]
      }
      streakGeo.attributes.position.needsUpdate = true
      radiant.scale.setScalar(1 + Math.sin(t * 3.2) * 0.18)
      radiant.rotation.z = t * 0.24
    },
    dispose() {
      streakGeo.dispose()
      streakMat.dispose()
      radiantGeo.dispose()
      radiantMat.dispose()
    },
  }
}
