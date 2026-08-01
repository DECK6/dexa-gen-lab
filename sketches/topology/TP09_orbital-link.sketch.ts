import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const VARIANT = 9

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 0, 7)

  const group = new THREE.Group()
  scene.add(group)
  const material = new THREE.MeshStandardMaterial({
    color: ctx.palette.signal,
    emissive: ctx.palette.signal,
    emissiveIntensity: 0.18,
    metalness: 0.25,
    roughness: 0.38,
    wireframe: VARIANT % 3 === 0,
  })
  const geometry = new THREE.TorusKnotGeometry(1.55, 0.16 + VARIANT * 0.012, 180, 18, 2 + (VARIANT % 4), 3 + (VARIANT % 5))
  const knot = new THREE.Mesh(geometry, material)
  group.add(knot)

  const lineMaterial = new THREE.LineBasicMaterial({ color: ctx.palette.accent, transparent: true, opacity: 0.78 })
  const lineGeometries: THREE.BufferGeometry[] = []
  for (let lane = 0; lane < 3 + (VARIANT % 3); lane++) {
    const points: THREE.Vector3[] = []
    for (let i = 0; i <= 180; i++) {
      const a = (i / 180) * Math.PI * 2
      const radius = 2.1 + lane * 0.18
      points.push(new THREE.Vector3(
        Math.cos(a) * radius,
        Math.sin(a) * radius,
        Math.sin(a * (2 + (VARIANT % 4)) + lane) * (0.35 + lane * 0.08),
      ))
    }
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    lineGeometries.push(lineGeometry)
    const line = new THREE.Line(lineGeometry, lineMaterial)
    line.rotation.set(lane * 0.45, lane * 0.3, lane * 0.2)
    group.add(line)
  }

  scene.add(new THREE.AmbientLight(ctx.palette.paper, 1.2))
  const light = new THREE.PointLight(ctx.palette.accent, 5, 20)
  light.position.set(3, 3, 4)
  scene.add(light)

  return {
    scene,
    camera,
    update: (t) => {
      group.rotation.x = t * (0.14 + VARIANT * 0.008)
      group.rotation.y = t * (0.22 + VARIANT * 0.01)
      knot.scale.setScalar(1 + Math.sin(t * 1.1 + VARIANT) * 0.055)
    },
    dispose: () => {
      geometry.dispose()
      for (const item of lineGeometries) item.dispose()
      material.dispose()
      lineMaterial.dispose()
    },
  }
}
