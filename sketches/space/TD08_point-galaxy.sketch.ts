import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 45000
const ARMS = 3
const RMAX = 9
const TWIST = 0.52

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)

  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 120)

  const rad = new Float32Array(COUNT)
  const ang0 = new Float32Array(COUNT)
  const pos = new Float32Array(COUNT * 3)
  const col = new Float32Array(COUNT * 3)
  const cCore = new THREE.Color(pal.accent)
  const cArm = new THREE.Color(pal.signal)
  const cTmp = new THREE.Color()

  for (let i = 0; i < COUNT; i++) {
    const u = Math.pow(ctx.random(), 0.62)
    const r = u * RMAX
    const arm = Math.floor(ctx.random() * ARMS)
    const spread = (0.5 + 1.6 / (1 + r)) * (ctx.random() + ctx.random() - 1)
    rad[i] = r
    ang0[i] = (arm / ARMS) * Math.PI * 2 + r * TWIST + spread
    const j = i * 3
    pos[j] = r
    pos[j + 1] = (ctx.random() + ctx.random() - 1) * (0.9 * Math.exp(-r / 3.2) + 0.06)
    pos[j + 2] = 0
    cTmp.lerpColors(cCore, cArm, Math.min(1, Math.pow(r / RMAX, 0.45) * 1.15))
    col[j] = cTmp.r
    col[j + 1] = cTmp.g
    col[j + 2] = cTmp.b
  }

  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('position', posAttr)
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geo, mat)
  scene.add(points)

  return {
    scene,
    camera,
    update(t) {
      for (let i = 0; i < COUNT; i++) {
        const r = rad[i]!
        // differential rotation: inner orbits sweep far faster than the rim
        const a = ang0[i]! + (t * 1.6) / (0.55 + r * 0.42)
        const j = i * 3
        pos[j] = Math.cos(a) * r
        pos[j + 2] = Math.sin(a) * r
      }
      posAttr.needsUpdate = true
      const tilt = 0.42 + Math.sin(t * 0.08) * 0.28
      const r = 20
      camera.position.set(Math.cos(t * 0.05) * r, Math.sin(tilt) * 14, Math.sin(t * 0.05) * r)
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
