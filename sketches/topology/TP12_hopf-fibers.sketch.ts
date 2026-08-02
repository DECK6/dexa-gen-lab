import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 13)
  const camera = new THREE.PerspectiveCamera(44, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0, 7.5)
  const layers = [new THREE.Group(), new THREE.Group()]
  scene.add(...layers)
  const segments = 128
  const fiberCount = 18
  const geometries: THREE.BufferGeometry[] = []
  const materials = [
    new THREE.LineBasicMaterial({ color: ctx.palette.signal, transparent: true, opacity: 0.82 }),
    new THREE.LineBasicMaterial({ color: ctx.palette.dim, transparent: true, opacity: 0.64 }),
  ]
  const project = (eta: number, phi: number, u: number, out: THREE.Vector3): void => {
    const x1 = Math.cos(eta) * Math.cos(u)
    const x2 = Math.cos(eta) * Math.sin(u)
    const x3 = Math.sin(eta) * Math.cos(u + phi)
    const x4 = Math.sin(eta) * Math.sin(u + phi)
    const scale = 1.15 / (1.18 - x4)
    out.set(x1 * scale, x2 * scale, x3 * scale)
  }
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  for (let layer = 0; layer < 2; layer++) {
    const positions = new Float32Array((fiberCount / 2) * segments * 6)
    let offset = 0
    for (let f = layer; f < fiberCount; f += 2) {
      const eta = 0.28 + (f / (fiberCount - 1)) * 0.86
      const phi = f * Math.PI * (2 / fiberCount)
      for (let i = 0; i < segments; i++) {
        project(eta, phi, (i / segments) * Math.PI * 2, a)
        project(eta, phi, ((i + 1) / segments) * Math.PI * 2, b)
        positions.set([a.x, a.y, a.z, b.x, b.y, b.z], offset)
        offset += 6
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometries.push(geometry)
    layers[layer].add(new THREE.LineSegments(geometry, materials[layer]))
  }
  const markerGeometry = new THREE.BufferGeometry()
  const markerPositions = new Float32Array(12 * 3)
  markerGeometry.setAttribute('position', new THREE.BufferAttribute(markerPositions, 3))
  const markerMaterial = new THREE.PointsMaterial({ color: ctx.palette.accent, size: 0.09 })
  scene.add(new THREE.Points(markerGeometry, markerMaterial))
  const phase = ctx.random()

  return {
    scene,
    camera,
    update: (t, _dt) => {
      for (let i = 0; i < 12; i++) {
        project(0.34 + i * 0.065, i * 0.7, (phase + t * 0.11 + i / 12) * Math.PI * 2, a)
        markerPositions[i * 3] = a.x
        markerPositions[i * 3 + 1] = a.y
        markerPositions[i * 3 + 2] = a.z
      }
      markerGeometry.attributes.position.needsUpdate = true
      layers[0].rotation.y = t * 0.12
      layers[1].rotation.x = -t * 0.09
    },
    dispose: () => {
      for (const geometry of geometries) geometry.dispose()
      for (const material of materials) material.dispose()
      markerGeometry.dispose()
      markerMaterial.dispose()
    },
  }
}
