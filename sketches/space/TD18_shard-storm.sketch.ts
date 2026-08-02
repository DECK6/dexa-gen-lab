import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 650

function smoothstep(x: number): number {
  const v = Math.min(1, Math.max(0, x))
  return v * v * (3 - 2 * v)
}

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 9, 28)
  const camera = new THREE.PerspectiveCamera(48, ctx.width / ctx.height, 0.1, 70)

  const geo = new THREE.ConeGeometry(0.11, 0.85, 3)
  const mat = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true })
  const shards = new THREE.InstancedMesh(geo, mat, COUNT)
  const data = new Float32Array(COUNT * 7)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  for (let i = 0; i < COUNT; i++) {
    const k = i * 7
    const y = (ctx.random() - 0.5) * 6.8
    const a = ctx.random() * Math.PI * 2
    const shapeR = 1.15 + Math.cos(y * 0.75) * 0.65
    data[k] = Math.cos(a) * shapeR
    data[k + 1] = y
    data[k + 2] = Math.sin(a) * shapeR
    data[k + 3] = 4 + ctx.random() * 6
    data[k + 4] = (ctx.random() - 0.5) * 10
    data[k + 5] = ctx.random() * Math.PI * 2
    data[k + 6] = 0.45 + ctx.random() * 0.8
    shards.setColorAt(i, ctx.random() < 0.045 ? accent : signal)
  }
  const group = new THREE.Group()
  group.add(shards)
  scene.add(group)
  const dummy = new THREE.Object3D()

  function storm(t: number) {
    const cycle = (t / 9 + 0.18) % 1
    const form = smoothstep((cycle - 0.04) / 0.2) * (1 - smoothstep((cycle - 0.66) / 0.25))
    for (let i = 0; i < COUNT; i++) {
      const k = i * 7
      const a = data[k + 5]! + t * data[k + 6]!
      const r = data[k + 3]! * (0.9 + Math.sin(t * 0.8 + i) * 0.1)
      const sx = Math.cos(a) * r
      const sy = data[k + 4]! + Math.sin(a * 1.7) * 1.2
      const sz = Math.sin(a) * r
      dummy.position.set(
        sx + (data[k]! - sx) * form,
        sy + (data[k + 1]! - sy) * form,
        sz + (data[k + 2]! - sz) * form,
      )
      dummy.rotation.set(a * 1.7, t * 1.2 + i * 0.13, a)
      dummy.scale.setScalar(0.55 + form * 0.6)
      dummy.updateMatrix()
      shards.setMatrixAt(i, dummy.matrix)
    }
    shards.instanceMatrix.needsUpdate = true
  }
  storm(0)

  return {
    scene,
    camera,
    update(t) {
      storm(t)
      group.rotation.y = t * 0.16
      camera.position.set(Math.cos(t * 0.09) * 15, 5, Math.sin(t * 0.09) * 15)
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
