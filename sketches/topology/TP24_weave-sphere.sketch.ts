import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 13)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0, 7)
  const group = new THREE.Group()
  scene.add(group)
  const count = 18
  const accentIndices = [2, 8, 14]
  const geometry = new THREE.TorusGeometry(1.58, 0.024, 5, 96)
  const material = new THREE.MeshBasicMaterial({ color: ctx.palette.signal, transparent: true, opacity: 0.76 })
  const accentMaterial = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const circles = new THREE.InstancedMesh(geometry, material, count)
  const accents = new THREE.InstancedMesh(geometry, accentMaterial, accentIndices.length)
  group.add(circles, accents)
  const normals: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  const seedAngle = ctx.random() * Math.PI * 2
  for (let i = 0; i < count; i++) {
    const y = 1 - ((i + 0.5) / count) * 2
    const radius = Math.sqrt(1 - y * y)
    const angle = seedAngle + i * golden
    normals.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius))
  }
  const zAxis = new THREE.Vector3(0, 0, 1)
  const xAxis = new THREE.Vector3(1, 0, 0)
  const yAxis = new THREE.Vector3(0, 1, 0)
  const normal = new THREE.Vector3()
  const origin = new THREE.Vector3()
  const scale = new THREE.Vector3(1, 1, 1)
  const accentScale = new THREE.Vector3(1.025, 1.025, 1.025)
  const quaternion = new THREE.Quaternion()
  const matrix = new THREE.Matrix4()

  return {
    scene,
    camera,
    update: (t, _dt) => {
      for (let i = 0; i < count; i++) {
        normal.copy(normals[i])
        normal.applyAxisAngle(yAxis, Math.sin(t * 0.42 + i) * 0.12)
        normal.applyAxisAngle(xAxis, Math.cos(t * 0.31 + i * 0.7) * 0.08).normalize()
        quaternion.setFromUnitVectors(zAxis, normal)
        matrix.compose(origin, quaternion, scale)
        circles.setMatrixAt(i, matrix)
        const accentIndex = accentIndices.indexOf(i)
        if (accentIndex >= 0) {
          matrix.compose(origin, quaternion, accentScale)
          accents.setMatrixAt(accentIndex, matrix)
        }
      }
      circles.instanceMatrix.needsUpdate = true
      accents.instanceMatrix.needsUpdate = true
      group.rotation.y = t * 0.13
      group.rotation.x = Math.sin(t * 0.27) * 0.12
    },
    dispose: () => {
      geometry.dispose()
      material.dispose()
      accentMaterial.dispose()
    },
  }
}
