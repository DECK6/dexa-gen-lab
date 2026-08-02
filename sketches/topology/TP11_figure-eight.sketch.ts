import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 12)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0.2, 7)
  const group = new THREE.Group()
  scene.add(group)

  const points: THREE.Vector3[] = []
  for (let i = 0; i < 320; i++) {
    const u = (i / 320) * Math.PI * 2
    points.push(new THREE.Vector3(
      (2 + Math.cos(2 * u)) * Math.cos(3 * u) * 0.62,
      (2 + Math.cos(2 * u)) * Math.sin(3 * u) * 0.62,
      Math.sin(4 * u) * 0.62,
    ))
  }
  const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal')
  const knotGeometry = new THREE.TubeGeometry(curve, 320, 0.055, 7, true)
  const knotMaterial = new THREE.MeshBasicMaterial({ color: ctx.palette.signal })
  group.add(new THREE.Mesh(knotGeometry, knotMaterial))

  const markerGeometry = new THREE.SphereGeometry(0.09, 8, 6)
  const markerMaterial = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const markers = new THREE.InstancedMesh(markerGeometry, markerMaterial, 9)
  group.add(markers)
  const matrix = new THREE.Matrix4()
  const marker = new THREE.Vector3()
  const phase = ctx.random()

  return {
    scene,
    camera,
    update: (t, _dt) => {
      for (let i = 0; i < 9; i++) {
        curve.getPointAt((phase + t * 0.075 + i * 0.014) % 1, marker)
        matrix.makeTranslation(marker.x, marker.y, marker.z)
        markers.setMatrixAt(i, matrix)
      }
      markers.instanceMatrix.needsUpdate = true
      group.rotation.y = t * 0.16
      group.rotation.x = Math.sin(t * 0.31) * 0.18
    },
    dispose: () => {
      knotGeometry.dispose()
      markerGeometry.dispose()
      knotMaterial.dispose()
      markerMaterial.dispose()
    },
  }
}
