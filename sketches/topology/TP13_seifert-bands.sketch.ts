import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 12)
  const camera = new THREE.PerspectiveCamera(43, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0.2, 6.8)
  const group = new THREE.Group()
  group.rotation.z = 0.25
  scene.add(group)
  const surfaceMaterial = new THREE.MeshBasicMaterial({
    color: ctx.palette.signal,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.34,
  })
  const diskMaterial = new THREE.MeshBasicMaterial({
    color: ctx.palette.dim,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.34,
  })
  const boundaryMaterial = new THREE.LineBasicMaterial({ color: ctx.palette.accent })
  const geometries: THREE.BufferGeometry[] = []
  for (const x of [-0.95, 0.95]) {
    const disk = new THREE.CircleGeometry(0.82, 48)
    const mesh = new THREE.Mesh(disk, diskMaterial)
    mesh.position.x = x
    mesh.rotation.y = Math.PI / 2
    group.add(mesh)
    geometries.push(disk)
  }
  const boundary: number[] = []
  for (let band = 0; band < 3; band++) {
    const segments = 40
    const positions: number[] = []
    const indices: number[] = []
    const phase = band * Math.PI * (2 / 3)
    for (let i = 0; i <= segments; i++) {
      const s = i / segments
      const x = (s - 0.5) * 1.9
      const y = Math.cos(phase) * 0.57 + Math.sin(s * Math.PI) * 0.16
      const z = Math.sin(phase) * 0.57 + Math.sin(s * Math.PI * 2 + phase) * 0.14
      const twist = phase + s * Math.PI
      for (const side of [-1, 1]) {
        positions.push(x, y + Math.cos(twist) * side * 0.19, z + Math.sin(twist) * side * 0.19)
      }
      if (i < segments) indices.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3)
    }
    for (let i = 0; i < segments; i++) {
      for (const side of [0, 1]) {
        const p = (i * 2 + side) * 3
        const q = ((i + 1) * 2 + side) * 3
        boundary.push(...positions.slice(p, p + 3), ...positions.slice(q, q + 3))
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setIndex(indices)
    group.add(new THREE.Mesh(geometry, surfaceMaterial))
    geometries.push(geometry)
  }
  const boundaryGeometry = new THREE.BufferGeometry()
  boundaryGeometry.setAttribute('position', new THREE.Float32BufferAttribute(boundary, 3))
  group.add(new THREE.LineSegments(boundaryGeometry, boundaryMaterial))
  geometries.push(boundaryGeometry)

  return {
    scene,
    camera,
    update: (t, _dt) => {
      group.rotation.y = t * 0.19
      group.rotation.x = 0.16 + Math.sin(t * 0.43) * 0.12
    },
    dispose: () => {
      for (const geometry of geometries) geometry.dispose()
      surfaceMaterial.dispose()
      diskMaterial.dispose()
      boundaryMaterial.dispose()
    },
  }
}
