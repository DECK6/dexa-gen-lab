import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 13)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0.3, 7.4)
  const group = new THREE.Group()
  group.rotation.x = -0.35
  scene.add(group)
  const size = 7
  const count = size * size
  const geometry = new THREE.TorusGeometry(0.39, 0.035, 6, 28)
  const material = new THREE.MeshBasicMaterial({ color: ctx.palette.signal })
  const accentMaterial = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const rings = new THREE.InstancedMesh(geometry, material, count)
  const accentCount = 5
  const accents = new THREE.InstancedMesh(geometry, accentMaterial, accentCount)
  group.add(rings, accents)
  const phases = new Float32Array(count)
  for (let i = 0; i < count; i++) phases[i] = ctx.random() * Math.PI * 2
  const dummy = new THREE.Object3D()

  const place = (index: number, t: number, accentIndex = -1): void => {
    const row = Math.floor(index / size)
    const column = index % size
    const wave = Math.sin(t * 1.15 + row * 0.7 + column * 0.48 + phases[index] * 0.14)
    dummy.position.set((column - 3) * 0.62, (row - 3) * 0.62, wave * 0.22)
    dummy.rotation.set(row % 2 === 0 ? Math.PI / 2 : 0, row % 2 === 0 ? 0 : Math.PI / 2, wave * 0.12)
    dummy.scale.setScalar(accentIndex < 0 ? 1 : 1.08)
    dummy.updateMatrix()
    if (accentIndex < 0) rings.setMatrixAt(index, dummy.matrix)
    else accents.setMatrixAt(accentIndex, dummy.matrix)
  }

  return {
    scene,
    camera,
    update: (t, _dt) => {
      for (let i = 0; i < count; i++) place(i, t)
      for (let i = 0; i < accentCount; i++) place(i * 10 + 4, t, i)
      rings.instanceMatrix.needsUpdate = true
      accents.instanceMatrix.needsUpdate = true
      group.rotation.z = Math.sin(t * 0.24) * 0.08
    },
    dispose: () => {
      geometry.dispose()
      material.dispose()
      accentMaterial.dispose()
    },
  }
}
