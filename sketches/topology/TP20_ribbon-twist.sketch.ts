import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 12)
  const camera = new THREE.PerspectiveCamera(43, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0, 6.7)
  const group = new THREE.Group()
  group.rotation.x = 0.5
  scene.add(group)
  const segments = 180
  const across = 10
  const positions = new Float32Array((segments + 1) * (across + 1) * 3)
  const indices: number[] = []
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < across; j++) {
      const a = i * (across + 1) + j
      const b = a + across + 1
      indices.push(a, b, a + 1, a + 1, b, b + 1)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
  geometry.setIndex(indices)
  const material = new THREE.MeshBasicMaterial({
    color: ctx.palette.signal,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.46,
  })
  group.add(new THREE.Mesh(geometry, material))
  const edgePositions = new Float32Array(segments * 12)
  const edgeGeometry = new THREE.BufferGeometry()
  edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3).setUsage(THREE.DynamicDrawUsage))
  const edgeMaterial = new THREE.LineBasicMaterial({ color: ctx.palette.accent })
  group.add(new THREE.LineSegments(edgeGeometry, edgeMaterial))
  const phase = ctx.random() * Math.PI * 2

  const deform = (t: number): void => {
    const twists = 1.2 + (0.5 + 0.5 * Math.sin(t * 0.58 + phase)) * 2.6
    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 2 * 0.985
      const cosine = Math.cos(u)
      const sine = Math.sin(u)
      for (let j = 0; j <= across; j++) {
        const width = (j / across - 0.5) * 0.72
        const twist = u * twists
        const radial = width * Math.cos(twist)
        const offset = (i * (across + 1) + j) * 3
        positions[offset] = (1.52 + radial) * cosine
        positions[offset + 1] = (1.52 + radial) * sine
        positions[offset + 2] = width * Math.sin(twist)
      }
    }
    for (let i = 0; i < segments; i++) {
      for (let side = 0; side < 2; side++) {
        const a = (i * (across + 1) + side * across) * 3
        const b = ((i + 1) * (across + 1) + side * across) * 3
        const target = (i * 2 + side) * 6
        edgePositions[target] = positions[a]
        edgePositions[target + 1] = positions[a + 1]
        edgePositions[target + 2] = positions[a + 2]
        edgePositions[target + 3] = positions[b]
        edgePositions[target + 4] = positions[b + 1]
        edgePositions[target + 5] = positions[b + 2]
      }
    }
    geometry.attributes.position.needsUpdate = true
    edgeGeometry.attributes.position.needsUpdate = true
  }
  deform(0)

  return {
    scene,
    camera,
    update: (t, _dt) => {
      deform(t)
      group.rotation.z = t * 0.12
      material.opacity = 0.4 + Math.sin(t * 0.58 + phase) * 0.08
    },
    dispose: () => {
      geometry.dispose()
      edgeGeometry.dispose()
      material.dispose()
      edgeMaterial.dispose()
    },
  }
}
