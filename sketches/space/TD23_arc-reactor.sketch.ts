import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const RINGS = 9
const ARCS = 3
const SEGMENTS = 18
const TOTAL = RINGS * ARCS * SEGMENTS

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 7, 20)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 50)
  camera.position.set(0, 0, 13)

  const pos = new Float32Array(TOTAL * 6)
  const col = new Float32Array(pos.length)
  const phase = new Float32Array(RINGS)
  const rate = new Float32Array(RINGS)
  for (let ring = 0; ring < RINGS; ring++) {
    phase[ring] = ctx.random() * Math.PI * 2
    rate[ring] = (ring % 2 === 0 ? 1 : -1) * (0.08 + ctx.random() * 0.13)
  }
  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  const colAttr = new THREE.BufferAttribute(col, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  colAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('position', posAttr)
  geo.setAttribute('color', colAttr)
  const mat = new THREE.LineBasicMaterial({ vertexColors: true })
  const reactor = new THREE.LineSegments(geo, mat)

  const sparkPos = new Float32Array(RINGS * 3)
  const sparkGeo = new THREE.BufferGeometry()
  const sparkAttr = new THREE.BufferAttribute(sparkPos, 3)
  sparkAttr.setUsage(THREE.DynamicDrawUsage)
  sparkGeo.setAttribute('position', sparkAttr)
  const sparkMat = new THREE.PointsMaterial({ color: new THREE.Color(pal.accent), size: 0.2, sizeAttenuation: true })
  const sparks = new THREE.Points(sparkGeo, sparkMat)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  const dim = new THREE.Color(pal.dim)
  const color = new THREE.Color()
  const coreGeo = new THREE.IcosahedronGeometry(0.52, 1)
  const coreMat = new THREE.MeshBasicMaterial({ color: accent, wireframe: true })
  const core = new THREE.Mesh(coreGeo, coreMat)
  const group = new THREE.Group()
  group.add(reactor, sparks, core)
  scene.add(group)

  function ignite(t: number) {
    const hot = Math.floor(t * 1.7) % RINGS
    let segment = 0
    for (let ring = 0; ring < RINGS; ring++) {
      const pulse = Math.pow((Math.sin(t * 2.3 - ring * 0.72 + phase[ring]!) + 1) * 0.5, 2)
      const radius = 1.05 + ring * 0.48 + pulse * 0.1
      const rotation = t * rate[ring]! + phase[ring]!
      color.lerpColors(dim, signal, 0.3 + pulse * 0.7)
      if (ring === hot) color.lerp(accent, 0.7)
      for (let arc = 0; arc < ARCS; arc++) {
        const start = rotation + (arc / ARCS) * Math.PI * 2
        for (let s = 0; s < SEGMENTS; s++) {
          const a0 = start + (s / SEGMENTS) * 1.55
          const a1 = start + ((s + 1) / SEGMENTS) * 1.55
          const k = segment++ * 6
          pos[k] = Math.cos(a0) * radius
          pos[k + 1] = Math.sin(a0) * radius
          pos[k + 2] = (ring - 4) * 0.025
          pos[k + 3] = Math.cos(a1) * radius
          pos[k + 4] = Math.sin(a1) * radius
          pos[k + 5] = pos[k + 2]
          col[k] = color.r
          col[k + 1] = color.g
          col[k + 2] = color.b
          col[k + 3] = color.r
          col[k + 4] = color.g
          col[k + 5] = color.b
        }
      }
      sparkPos[ring * 3] = Math.cos(rotation + 1.55) * radius
      sparkPos[ring * 3 + 1] = Math.sin(rotation + 1.55) * radius
      sparkPos[ring * 3 + 2] = (ring - 4) * 0.025
    }
    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
    sparkAttr.needsUpdate = true
    core.scale.setScalar(0.8 + Math.sin(t * 2.3) * 0.18)
  }
  ignite(0)

  return {
    scene,
    camera,
    update(t) {
      ignite(t)
      group.rotation.x = Math.sin(t * 0.17) * 0.28
      group.rotation.y = Math.sin(t * 0.11) * 0.2
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      sparkGeo.dispose()
      sparkMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
    },
  }
}
