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
  const sides = 6
  const levels = 25
  const vertices = new Float32Array(sides * levels * 3)
  const segmentCount = levels * sides + (levels - 1) * sides
  const segments = new Float32Array(segmentCount * 6)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(segments, 3).setUsage(THREE.DynamicDrawUsage))
  const material = new THREE.LineBasicMaterial({ color: ctx.palette.signal })
  group.add(new THREE.LineSegments(geometry, material))
  const capPositions = new Float32Array(sides * 4 * 3)
  const capGeometry = new THREE.BufferGeometry()
  capGeometry.setAttribute('position', new THREE.BufferAttribute(capPositions, 3).setUsage(THREE.DynamicDrawUsage))
  const capMaterial = new THREE.LineBasicMaterial({ color: ctx.palette.accent })
  group.add(new THREE.LineSegments(capGeometry, capMaterial))
  const phase = ctx.random() * Math.PI * 2
  let edgeOffset = 0
  const writeEdge = (a: number, b: number, target: Float32Array): void => {
    const start = a * 3
    const end = b * 3
    target[edgeOffset] = vertices[start]
    target[edgeOffset + 1] = vertices[start + 1]
    target[edgeOffset + 2] = vertices[start + 2]
    target[edgeOffset + 3] = vertices[end]
    target[edgeOffset + 4] = vertices[end + 1]
    target[edgeOffset + 5] = vertices[end + 2]
    edgeOffset += 6
  }

  const updateGeometry = (t: number): void => {
    for (let level = 0; level < levels; level++) {
      const y = (level / (levels - 1) - 0.5) * 3.8
      const twist = y * 1.05 + Math.sin(t * 0.75 + y * 0.8 + phase) * 0.22
      const radius = 1.05 + Math.sin(t * 0.62 + y * 1.4) * 0.09
      for (let side = 0; side < sides; side++) {
        const angle = (side / sides) * Math.PI * 2 + twist
        const offset = (level * sides + side) * 3
        vertices[offset] = Math.cos(angle) * radius
        vertices[offset + 1] = y
        vertices[offset + 2] = Math.sin(angle) * radius
      }
    }
    edgeOffset = 0
    for (let level = 0; level < levels; level++) {
      for (let side = 0; side < sides; side++) writeEdge(level * sides + side, level * sides + (side + 1) % sides, segments)
    }
    for (let level = 0; level < levels - 1; level++) {
      for (let side = 0; side < sides; side++) writeEdge(level * sides + side, (level + 1) * sides + side, segments)
    }
    edgeOffset = 0
    for (const level of [0, levels - 1]) {
      for (let side = 0; side < sides; side++) writeEdge(level * sides + side, level * sides + (side + 1) % sides, capPositions)
    }
    geometry.attributes.position.needsUpdate = true
    capGeometry.attributes.position.needsUpdate = true
  }
  updateGeometry(0)

  return {
    scene,
    camera,
    update: (t, _dt) => {
      updateGeometry(t)
      group.rotation.y = t * 0.14
    },
    dispose: () => {
      geometry.dispose()
      capGeometry.dispose()
      material.dispose()
      capMaterial.dispose()
    },
  }
}
