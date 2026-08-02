import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 12)
  const camera = new THREE.PerspectiveCamera(43, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0, 6.5)
  const group = new THREE.Group()
  scene.add(group)
  const count = 420
  const positions = new Float32Array(count * 3)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
  const lineMaterial = new THREE.LineBasicMaterial({ color: ctx.palette.signal })
  const pointMaterial = new THREE.PointsMaterial({ color: ctx.palette.signal, size: 0.026, transparent: true, opacity: 0.8 })
  group.add(new THREE.LineLoop(geometry, lineMaterial), new THREE.Points(geometry, pointMaterial))
  const markerPositions = new Float32Array(12 * 3)
  const markerGeometry = new THREE.BufferGeometry()
  markerGeometry.setAttribute('position', new THREE.BufferAttribute(markerPositions, 3).setUsage(THREE.DynamicDrawUsage))
  const markerMaterial = new THREE.PointsMaterial({ color: ctx.palette.accent, size: 0.085 })
  group.add(new THREE.Points(markerGeometry, markerMaterial))
  const phaseOffset = ctx.random() * Math.PI * 2

  const writeCurve = (t: number): void => {
    const amount = 0.5 + 0.5 * Math.cos(t * 0.72)
    for (let i = 0; i < count; i++) {
      const u = (i / count) * Math.PI * 2
      const phase = u + amount * 0.72 * Math.sin(2 * u)
      const radius = 1.45 + amount * 0.34 * Math.cos(3 * u)
      const offset = i * 3
      positions[offset] = Math.cos(phase) * radius
      positions[offset + 1] = Math.sin(phase) * radius
      positions[offset + 2] = amount * 0.82 * Math.sin(3 * u)
    }
    geometry.attributes.position.needsUpdate = true
    for (let i = 0; i < 12; i++) {
      const source = (Math.floor((i / 12 + t * 0.035) * count) % count) * 3
      markerPositions[i * 3] = positions[source]
      markerPositions[i * 3 + 1] = positions[source + 1]
      markerPositions[i * 3 + 2] = positions[source + 2]
    }
    markerGeometry.attributes.position.needsUpdate = true
  }
  writeCurve(phaseOffset)

  return {
    scene,
    camera,
    update: (t, _dt) => {
      writeCurve(t + phaseOffset)
      group.rotation.y = t * 0.12
      group.rotation.x = Math.sin(t * 0.28) * 0.2
    },
    dispose: () => {
      geometry.dispose()
      markerGeometry.dispose()
      lineMaterial.dispose()
      pointMaterial.dispose()
      markerMaterial.dispose()
    },
  }
}
