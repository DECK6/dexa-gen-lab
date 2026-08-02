import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 2200

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 8, 24)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 60)

  const elements = new Float32Array(COUNT * 5)
  const pos = new Float32Array(COUNT * 3)
  const col = new Float32Array(COUNT * 3)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  for (let i = 0; i < COUNT; i++) {
    const k = i * 5
    elements[k] = 2.1 + ctx.random() * 4.5
    elements[k + 1] = 0.02 + ctx.random() * 0.24
    elements[k + 2] = (ctx.random() - 0.5) * 0.24
    elements[k + 3] = ctx.random() * Math.PI * 2
    elements[k + 4] = ctx.random() * Math.PI * 2
    const c = ctx.random() < 0.035 ? accent : signal
    col[i * 3] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }
  const debrisGeo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  debrisGeo.setAttribute('position', posAttr)
  debrisGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const debrisMat = new THREE.PointsMaterial({ size: 0.055, vertexColors: true, sizeAttenuation: true })
  scene.add(new THREE.Points(debrisGeo, debrisMat))

  const planetGeo = new THREE.IcosahedronGeometry(1.25, 2)
  const planetMat = new THREE.MeshBasicMaterial({ color: signal, wireframe: true })
  const planet = new THREE.Mesh(planetGeo, planetMat)
  scene.add(planet)

  function orbit(t: number) {
    for (let i = 0; i < COUNT; i++) {
      const k = i * 5
      const a = elements[k]!
      const e = elements[k + 1]!
      const inc = elements[k + 2]!
      const node = elements[k + 3]!
      const mean = elements[k + 4]! + (t * 2.8) / Math.pow(a, 1.5)
      let anomaly = mean
      for (let n = 0; n < 3; n++) anomaly -= (anomaly - e * Math.sin(anomaly) - mean) / (1 - e * Math.cos(anomaly))
      const x = a * (Math.cos(anomaly) - e)
      const z = a * Math.sqrt(1 - e * e) * Math.sin(anomaly)
      const y = -z * Math.sin(inc)
      const flatZ = z * Math.cos(inc)
      const j = i * 3
      pos[j] = x * Math.cos(node) + flatZ * Math.sin(node)
      pos[j + 1] = y
      pos[j + 2] = -x * Math.sin(node) + flatZ * Math.cos(node)
    }
    posAttr.needsUpdate = true
  }
  orbit(0)

  return {
    scene,
    camera,
    update(t) {
      orbit(t)
      planet.rotation.y = t * 0.18
      planet.rotation.z = 0.18
      camera.position.set(Math.cos(t * 0.08) * 13, 6 + Math.sin(t * 0.11) * 2, Math.sin(t * 0.08) * 13)
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      debrisGeo.dispose()
      debrisMat.dispose()
      planetGeo.dispose()
      planetMat.dispose()
    },
  }
}
