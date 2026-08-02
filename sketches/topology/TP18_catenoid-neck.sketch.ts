import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 13)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0, 7)
  const group = new THREE.Group()
  group.rotation.x = 0.18
  scene.add(group)
  const around = 72
  const vertical = 30
  const positions = new Float32Array((around + 1) * (vertical + 1) * 3)
  const indices: number[] = []
  for (let i = 0; i < around; i++) {
    for (let j = 0; j < vertical; j++) {
      const a = i * (vertical + 1) + j
      const b = a + vertical + 1
      indices.push(a, b, a + 1, a + 1, b, b + 1)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
  geometry.setIndex(indices)
  const material = new THREE.MeshBasicMaterial({
    color: ctx.palette.signal,
    side: THREE.DoubleSide,
    wireframe: true,
    transparent: true,
    opacity: 0.62,
  })
  group.add(new THREE.Mesh(geometry, material))
  const neckPositions = new Float32Array(around * 3)
  const neckGeometry = new THREE.BufferGeometry()
  neckGeometry.setAttribute('position', new THREE.BufferAttribute(neckPositions, 3).setUsage(THREE.DynamicDrawUsage))
  const neckMaterial = new THREE.LineBasicMaterial({ color: ctx.palette.accent })
  group.add(new THREE.LineLoop(neckGeometry, neckMaterial))
  const phase = ctx.random() * Math.PI * 2

  const deform = (t: number): void => {
    const neck = 0.58 + (0.5 + 0.5 * Math.sin(t * 0.82 + phase)) * 0.28
    for (let i = 0; i <= around; i++) {
      const u = (i / around) * Math.PI * 2
      for (let j = 0; j <= vertical; j++) {
        const y = (j / vertical - 0.5) * 2.8
        const radius = neck * Math.cosh(y / neck) * 0.78
        const offset = (i * (vertical + 1) + j) * 3
        positions[offset] = Math.cos(u) * radius
        positions[offset + 1] = y
        positions[offset + 2] = Math.sin(u) * radius
      }
      if (i < around) {
        neckPositions[i * 3] = Math.cos(u) * neck * 0.78
        neckPositions[i * 3 + 1] = 0
        neckPositions[i * 3 + 2] = Math.sin(u) * neck * 0.78
      }
    }
    geometry.attributes.position.needsUpdate = true
    neckGeometry.attributes.position.needsUpdate = true
  }
  deform(0)

  return {
    scene,
    camera,
    update: (t, _dt) => {
      deform(t)
      group.rotation.y = t * 0.19
      group.rotation.z = Math.sin(t * 0.3) * 0.08
    },
    dispose: () => {
      geometry.dispose()
      neckGeometry.dispose()
      material.dispose()
      neckMaterial.dispose()
    },
  }
}
