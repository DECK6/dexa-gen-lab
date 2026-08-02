import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const RINGS = 7

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 8, 24)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 60)

  const signalMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(pal.signal), wireframe: true })
  const accentMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(pal.accent), wireframe: true })
  const geos: THREE.BufferGeometry[] = []
  const pivots: THREE.Object3D[] = []
  const phase = new Float32Array(RINGS)
  const rate = new Float32Array(RINGS)
  const root = new THREE.Group()
  let parent: THREE.Object3D = root
  for (let i = 0; i < RINGS; i++) {
    const geo = new THREE.TorusGeometry(2 + i * 0.52, 0.035 + i * 0.003, 3, 112)
    const ring = new THREE.Mesh(geo, i === RINGS - 2 ? accentMat : signalMat)
    ring.rotation.x = (i % 3) * Math.PI / 3
    ring.rotation.y = i * 0.31
    const pivot = new THREE.Object3D()
    pivot.add(ring)
    parent.add(pivot)
    parent = pivot
    geos.push(geo)
    pivots.push(pivot)
    phase[i] = ctx.random() * Math.PI * 2
    rate[i] = (i % 2 === 0 ? 1 : -1) * (0.07 + ctx.random() * 0.1)
  }
  scene.add(root)
  const coreGeo = new THREE.IcosahedronGeometry(0.55, 0)
  const coreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(pal.accent), wireframe: true })
  scene.add(new THREE.Mesh(coreGeo, coreMat))

  return {
    scene,
    camera,
    update(t) {
      for (let i = 0; i < RINGS; i++) {
        const pivot = pivots[i]!
        pivot.rotation.x = Math.sin(t * rate[i]! + phase[i]!) * 0.38
        pivot.rotation.y = t * rate[i]! + phase[i]!
        pivot.rotation.z = Math.cos(t * rate[i]! * 0.7 + phase[i]!) * 0.24
      }
      root.rotation.y = t * 0.08
      camera.position.set(Math.cos(t * 0.09) * 13, 5 + Math.sin(t * 0.13) * 2, Math.sin(t * 0.09) * 13)
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      for (const geo of geos) geo.dispose()
      signalMat.dispose()
      accentMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
    },
  }
}
