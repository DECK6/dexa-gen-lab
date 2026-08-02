import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 13)
  const camera = new THREE.PerspectiveCamera(43, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0, 6.5)
  const group = new THREE.Group()
  group.rotation.x = 0.35
  scene.add(group)
  const point = new THREE.Vector3()
  const immerse = (u: number, v: number, out: THREE.Vector3): void => {
    out.set(
      Math.sin(2 * u) * Math.cos(v) * Math.cos(v),
      Math.sin(u) * Math.sin(2 * v),
      Math.cos(u) * Math.sin(2 * v),
    ).multiplyScalar(1.7)
  }
  const uSteps = 72
  const vSteps = 36
  const positions: number[] = []
  const indices: number[] = []
  for (let i = 0; i <= uSteps; i++) {
    for (let j = 0; j <= vSteps; j++) {
      immerse((i / uSteps) * Math.PI, (j / vSteps) * Math.PI, point)
      positions.push(point.x, point.y, point.z)
      if (i < uSteps && j < vSteps) {
        const a = i * (vSteps + 1) + j
        const b = a + vSteps + 1
        indices.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
  }
  const surfaceGeometry = new THREE.BufferGeometry()
  surfaceGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  surfaceGeometry.setIndex(indices)
  const surfaceMaterial = new THREE.MeshBasicMaterial({
    color: ctx.palette.dim,
    side: THREE.DoubleSide,
    wireframe: true,
    transparent: true,
    opacity: 0.38,
  })
  group.add(new THREE.Mesh(surfaceGeometry, surfaceMaterial))
  const pathPositions: number[] = []
  const pathCount = 12
  const pathSteps = 100
  for (let path = 0; path < pathCount; path++) {
    const v = ((path + 0.5) / pathCount) * Math.PI
    for (let i = 0; i < pathSteps; i++) {
      immerse((i / pathSteps) * Math.PI, v, point)
      pathPositions.push(point.x, point.y, point.z)
      immerse(((i + 1) / pathSteps) * Math.PI, v, point)
      pathPositions.push(point.x, point.y, point.z)
    }
  }
  const pathGeometry = new THREE.BufferGeometry()
  pathGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pathPositions, 3))
  const pathMaterial = new THREE.LineBasicMaterial({ color: ctx.palette.signal, transparent: true, opacity: 0.82 })
  group.add(new THREE.LineSegments(pathGeometry, pathMaterial))
  const tracerPositions = new Float32Array(pathCount * 3)
  const tracerGeometry = new THREE.BufferGeometry()
  tracerGeometry.setAttribute('position', new THREE.BufferAttribute(tracerPositions, 3).setUsage(THREE.DynamicDrawUsage))
  const tracerMaterial = new THREE.PointsMaterial({ color: ctx.palette.accent, size: 0.09 })
  group.add(new THREE.Points(tracerGeometry, tracerMaterial))
  const phase = ctx.random()

  return {
    scene,
    camera,
    update: (t, _dt) => {
      for (let i = 0; i < pathCount; i++) {
        immerse(((phase + t * 0.08 + i / pathCount) % 1) * Math.PI, ((i + 0.5) / pathCount) * Math.PI, point)
        tracerPositions[i * 3] = point.x
        tracerPositions[i * 3 + 1] = point.y
        tracerPositions[i * 3 + 2] = point.z
      }
      tracerGeometry.attributes.position.needsUpdate = true
      group.rotation.y = t * 0.16
      group.rotation.z = Math.sin(t * 0.3) * 0.12
    },
    dispose: () => {
      surfaceGeometry.dispose()
      pathGeometry.dispose()
      tracerGeometry.dispose()
      surfaceMaterial.dispose()
      pathMaterial.dispose()
      tracerMaterial.dispose()
    },
  }
}
