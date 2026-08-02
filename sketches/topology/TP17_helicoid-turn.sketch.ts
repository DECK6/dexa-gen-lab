import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 13)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0, 7.2)
  const group = new THREE.Group()
  scene.add(group)
  const turns = 80
  const radial = 20
  const positions: number[] = []
  const indices: number[] = []
  for (let i = 0; i <= turns; i++) {
    const theta = (i / turns - 0.5) * Math.PI * 4
    for (let j = 0; j <= radial; j++) {
      const radius = (j / radial - 0.5) * 3.1
      positions.push(Math.cos(theta) * radius, theta * 0.22, Math.sin(theta) * radius)
      if (i < turns && j < radial) {
        const a = i * (radial + 1) + j
        const b = a + radial + 1
        indices.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  const material = new THREE.MeshBasicMaterial({
    color: ctx.palette.signal,
    side: THREE.DoubleSide,
    wireframe: true,
    transparent: true,
    opacity: 0.58,
  })
  group.add(new THREE.Mesh(geometry, material))
  const edgePositions: number[] = []
  for (const radius of [-1.55, 1.55]) {
    for (let i = 0; i < turns; i++) {
      for (const step of [i, i + 1]) {
        const theta = (step / turns - 0.5) * Math.PI * 4
        edgePositions.push(Math.cos(theta) * radius, theta * 0.22, Math.sin(theta) * radius)
      }
    }
  }
  const edgeGeometry = new THREE.BufferGeometry()
  edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3))
  const edgeMaterial = new THREE.LineBasicMaterial({ color: ctx.palette.accent })
  group.add(new THREE.LineSegments(edgeGeometry, edgeMaterial))
  const phase = ctx.random() * Math.PI * 2

  return {
    scene,
    camera,
    update: (t, _dt) => {
      group.rotation.y = t * 0.23
      group.rotation.z = Math.sin(t * 0.36 + phase) * 0.13
      group.scale.y = 1 + Math.sin(t * 0.64 + phase) * 0.08
    },
    dispose: () => {
      geometry.dispose()
      edgeGeometry.dispose()
      material.dispose()
      edgeMaterial.dispose()
    },
  }
}
