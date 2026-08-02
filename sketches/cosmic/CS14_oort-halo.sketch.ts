import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 3600

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 8, 18)
  const camera = new THREE.PerspectiveCamera(47, ctx.width / ctx.height, 0.1, 40)

  const radius = new Float32Array(COUNT)
  const phase = new Float32Array(COUNT)
  const speed = new Float32Array(COUNT)
  const node = new Float32Array(COUNT)
  const inclination = new Float32Array(COUNT)
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    radius[i] = 3.1 + Math.pow(ctx.random(), 0.65) * 2.4
    phase[i] = ctx.random() * Math.PI * 2
    speed[i] = 0.09 + ctx.random() * 0.22
    node[i] = ctx.random() * Math.PI * 2
    inclination[i] = Math.acos(2 * ctx.random() - 1)
  }
  const haloGeo = new THREE.BufferGeometry()
  haloGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const haloMat = new THREE.PointsMaterial({
    color: ctx.palette.signal, size: 0.028, transparent: true, opacity: 0.75, depthWrite: false,
  })
  scene.add(new THREE.Points(haloGeo, haloMat))
  const markerGeo = new THREE.IcosahedronGeometry(1.25, 1)
  const markerMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent, wireframe: true, transparent: true, opacity: 0.45 })
  scene.add(new THREE.Mesh(markerGeo, markerMat))

  return {
    scene,
    camera,
    update(t, _dt) {
      for (let i = 0; i < COUNT; i++) {
        const a = phase[i] + t * speed[i]
        const ca = Math.cos(a)
        const sa = Math.sin(a)
        const cn = Math.cos(node[i])
        const sn = Math.sin(node[i])
        const ci = Math.cos(inclination[i])
        const si = Math.sin(inclination[i])
        const k = i * 3
        positions[k] = radius[i] * (ca * cn - sa * ci * sn)
        positions[k + 1] = radius[i] * sa * si
        positions[k + 2] = radius[i] * (ca * sn + sa * ci * cn)
      }
      haloGeo.attributes.position.needsUpdate = true
      camera.position.set(Math.sin(t * 0.07) * 1.8, 1.6 + Math.sin(t * 0.11), 11)
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      haloGeo.dispose()
      haloMat.dispose()
      markerGeo.dispose()
      markerMat.dispose()
    },
  }
}
