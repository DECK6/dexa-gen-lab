import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const W = 30
const H = 22
const REST = 0.25
const COUNT = W * H

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 7, 22)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 50)
  camera.position.set(0, 0, 11)

  const pos = new Float32Array(COUNT * 3)
  const prev = new Float32Array(COUNT * 3)
  const col = new Float32Array(COUNT * 3)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x
      const j = i * 3
      pos[j] = (x - (W - 1) / 2) * REST
      pos[j + 1] = 2.7 - y * REST
      pos[j + 2] = (ctx.random() - 0.5) * 0.012
      prev[j] = pos[j]
      prev[j + 1] = pos[j + 1]
      prev[j + 2] = pos[j + 2]
      const c = x === 0 || x === W - 1 || y === H - 1 ? accent : signal
      col[j] = c.r
      col[j + 1] = c.g
      col[j + 2] = c.b
    }
  }
  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('position', posAttr)
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({ size: 0.095, vertexColors: true, sizeAttenuation: true })
  const cloth = new THREE.Points(geo, mat)
  scene.add(cloth)

  function constrain(a: number, b: number) {
    if (a < W && b < W) return
    const ia = a * 3
    const ib = b * 3
    const dx = pos[ib]! - pos[ia]!
    const dy = pos[ib + 1]! - pos[ia + 1]!
    const dz = pos[ib + 2]! - pos[ia + 2]!
    const dist = Math.max(1e-6, Math.hypot(dx, dy, dz))
    const wa = a >= W ? 1 : 0
    const wb = b >= W ? 1 : 0
    const correction = (dist - REST) / dist / (wa + wb)
    pos[ia] += dx * correction * wa
    pos[ia + 1] += dy * correction * wa
    pos[ia + 2] += dz * correction * wa
    pos[ib] -= dx * correction * wb
    pos[ib + 1] -= dy * correction * wb
    pos[ib + 2] -= dz * correction * wb
  }

  let steps = 0
  function simulate() {
    const time = steps / 60
    for (let i = W; i < COUNT; i++) {
      const j = i * 3
      const x = pos[j]!
      const y = pos[j + 1]!
      const vx = (x - prev[j]!) * 0.994
      const vy = (y - prev[j + 1]!) * 0.994
      const vz = (pos[j + 2]! - prev[j + 2]!) * 0.994
      prev[j] = x
      prev[j + 1] = y
      prev[j + 2] = pos[j + 2]!
      pos[j] = x + vx + Math.sin(time * 1.3 + y) * 0.0008
      pos[j + 1] = y + vy - 0.0024
      pos[j + 2] += vz + Math.sin(time * 2 + x * 0.8 + y * 0.4) * 0.0045
    }
    for (let pass = 0; pass < 3; pass++) {
      for (let y = 0; y < H; y++) for (let x = 0; x < W - 1; x++) constrain(y * W + x, y * W + x + 1)
      for (let y = 0; y < H - 1; y++) for (let x = 0; x < W; x++) constrain(y * W + x, (y + 1) * W + x)
    }
    steps++
  }

  return {
    scene,
    camera,
    update(t) {
      const target = Math.floor(t * 60)
      while (steps < target) simulate()
      posAttr.needsUpdate = true
      cloth.rotation.y = Math.sin(t * 0.23) * 0.28
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
