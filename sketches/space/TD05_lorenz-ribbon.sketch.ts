import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const TRAIL = 900
const H = 0.0045 // integration step (seconds of attractor time)
const MAX_STEPS = 60
const SCALE = 0.42
const SIGMA = 10
const RHO = 28
const BETA = 8 / 3

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 14, 44)

  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 120)

  let sx = 0.4 + ctx.random() * 0.6
  let sy = 0.5 + ctx.random() * 0.6
  let sz = 12 + ctx.random() * 6

  const hist = new Float32Array(TRAIL * 3)
  function step() {
    const dx = SIGMA * (sy - sx)
    const dy = sx * (RHO - sz) - sy
    const dz = sx * sy - BETA * sz
    sx += dx * H
    sy += dy * H
    sz += dz * H
    hist.copyWithin(0, 3)
    const j = (TRAIL - 1) * 3
    hist[j] = sx * SCALE
    hist[j + 1] = (sz - 25) * SCALE
    hist[j + 2] = sy * SCALE
  }
  for (let i = 0; i < TRAIL + 400; i++) step()

  const pos = new Float32Array(TRAIL * 2 * 3)
  const col = new Float32Array(TRAIL * 2 * 3)
  const idx: number[] = []
  const cTail = new THREE.Color(pal.dim)
  const cSignal = new THREE.Color(pal.signal)
  const cHead = new THREE.Color(pal.accent)
  const cTmp = new THREE.Color()
  for (let i = 0; i < TRAIL; i++) {
    const f = i / (TRAIL - 1)
    if (f < 0.85) cTmp.lerpColors(cTail, cSignal, f / 0.85)
    else cTmp.lerpColors(cSignal, cHead, (f - 0.85) / 0.15)
    for (let s = 0; s < 2; s++) {
      const k = (i * 2 + s) * 3
      col[k] = cTmp.r
      col[k + 1] = cTmp.g
      col[k + 2] = cTmp.b
    }
    if (i < TRAIL - 1) {
      const b = i * 2
      idx.push(b, b + 1, b + 3, b, b + 3, b + 2)
    }
  }

  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('position', posAttr)
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  geo.setIndex(idx)
  const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })
  scene.add(new THREE.Mesh(geo, mat))

  const up = new THREE.Vector3(0, 1, 0)
  const tan = new THREE.Vector3()
  const bin = new THREE.Vector3()

  function ribbon() {
    for (let i = 0; i < TRAIL; i++) {
      const a = Math.max(0, i - 1) * 3
      const b = Math.min(TRAIL - 1, i + 1) * 3
      tan.set(hist[b]! - hist[a]!, hist[b + 1]! - hist[a + 1]!, hist[b + 2]! - hist[a + 2]!)
      bin.crossVectors(tan, up)
      if (bin.lengthSq() < 1e-8) bin.set(1, 0, 0)
      const w = (0.06 + (i / (TRAIL - 1)) * 0.5) * 0.9
      bin.normalize().multiplyScalar(w)
      const j = i * 3
      const k = i * 6
      pos[k] = hist[j]! + bin.x
      pos[k + 1] = hist[j + 1]! + bin.y
      pos[k + 2] = hist[j + 2]! + bin.z
      pos[k + 3] = hist[j]! - bin.x
      pos[k + 4] = hist[j + 1]! - bin.y
      pos[k + 5] = hist[j + 2]! - bin.z
    }
    posAttr.needsUpdate = true
  }
  ribbon()

  let done = 0
  return {
    scene,
    camera,
    update(t) {
      const target = Math.floor(t / H)
      let n = Math.min(target - done, MAX_STEPS)
      while (n-- > 0) {
        step()
        done++
      }
      ribbon()
      const r = 30
      camera.position.set(Math.cos(t * 0.14) * r, 6 + Math.sin(t * 0.09) * 5, Math.sin(t * 0.14) * r)
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
