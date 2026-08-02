import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const DISK = 2200
const JET = 900

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 9, 22)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 50)
  camera.position.set(7, 4.8, 8)
  camera.lookAt(0, 0, 0)

  const diskSeed = new Float32Array(DISK * 4)
  const diskPos = new Float32Array(DISK * 3)
  for (let i = 0; i < DISK; i++) {
    diskSeed[i * 4] = ctx.random()
    diskSeed[i * 4 + 1] = ctx.random() * Math.PI * 2
    diskSeed[i * 4 + 2] = ctx.random() - 0.5
    diskSeed[i * 4 + 3] = 0.05 + ctx.random() * 0.08
  }
  const diskGeo = new THREE.BufferGeometry()
  diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPos, 3))
  const diskMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.036, transparent: true, opacity: 0.82, depthWrite: false,
  })
  scene.add(new THREE.Points(diskGeo, diskMat))

  const jetSeed = new Float32Array(JET * 3)
  const jetPos = new Float32Array(JET * 3)
  for (let i = 0; i < JET; i++) {
    jetSeed[i * 3] = ctx.random()
    jetSeed[i * 3 + 1] = ctx.random() * Math.PI * 2
    jetSeed[i * 3 + 2] = i % 2 ? 1 : -1
  }
  const jetGeo = new THREE.BufferGeometry()
  jetGeo.setAttribute('position', new THREE.BufferAttribute(jetPos, 3))
  const jetMat = new THREE.PointsMaterial({ color: ctx.palette.paper, size: 0.045, transparent: true, opacity: 0.7 })
  scene.add(new THREE.Points(jetGeo, jetMat))
  const coreGeo = new THREE.SphereGeometry(0.42, 20, 14)
  const coreMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const core = new THREE.Mesh(coreGeo, coreMat)
  scene.add(core)

  return {
    scene,
    camera,
    update(t, _dt) {
      for (let i = 0; i < DISK; i++) {
        const k4 = i * 4
        const u = (diskSeed[k4] + t * diskSeed[k4 + 3]) % 1
        const r = 0.48 + 4.1 * (1 - u) * (1 - u)
        const a = diskSeed[k4 + 1] + u * 11 + t * 0.28
        const k = i * 3
        diskPos[k] = Math.cos(a) * r
        diskPos[k + 1] = diskSeed[k4 + 2] * (0.08 + r * 0.08)
        diskPos[k + 2] = Math.sin(a) * r
      }
      for (let i = 0; i < JET; i++) {
        const k = i * 3
        const u = (jetSeed[k] + t * 0.22) % 1
        const y = jetSeed[k + 2] * (0.45 + u * 5.6)
        const r = 0.04 + u * 0.38
        jetPos[k] = Math.cos(jetSeed[k + 1] + u * 18) * r
        jetPos[k + 1] = y
        jetPos[k + 2] = Math.sin(jetSeed[k + 1] + u * 18) * r
      }
      diskGeo.attributes.position.needsUpdate = true
      jetGeo.attributes.position.needsUpdate = true
      core.scale.setScalar(1 + Math.sin(t * 3.4) * 0.08)
    },
    dispose() {
      diskGeo.dispose()
      diskMat.dispose()
      jetGeo.dispose()
      jetMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
    },
  }
}
