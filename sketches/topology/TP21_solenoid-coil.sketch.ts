import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 13)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0.3, 7.2)
  const group = new THREE.Group()
  group.rotation.x = 0.65
  scene.add(group)
  const major = 1.55
  const minor = 0.52
  const windings = 28 + Math.floor(ctx.random() * 5)
  const points: THREE.Vector3[] = []
  for (let i = 0; i < 560; i++) {
    const u = (i / 560) * Math.PI * 2
    const radius = major + minor * Math.cos(windings * u)
    points.push(new THREE.Vector3(radius * Math.cos(u), radius * Math.sin(u), minor * Math.sin(windings * u)))
  }
  const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal')
  const coilGeometry = new THREE.TubeGeometry(curve, 720, 0.027, 5, true)
  const coilMaterial = new THREE.MeshBasicMaterial({ color: ctx.palette.signal })
  group.add(new THREE.Mesh(coilGeometry, coilMaterial))
  const shellGeometry = new THREE.TorusGeometry(major, 0.7, 10, 72)
  const shellMaterial = new THREE.MeshBasicMaterial({
    color: ctx.palette.dim,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  })
  group.add(new THREE.Mesh(shellGeometry, shellMaterial))
  const markerGeometry = new THREE.SphereGeometry(0.075, 7, 5)
  const markerMaterial = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const markers = new THREE.InstancedMesh(markerGeometry, markerMaterial, 12)
  group.add(markers)
  const marker = new THREE.Vector3()
  const matrix = new THREE.Matrix4()
  const phase = ctx.random()

  return {
    scene,
    camera,
    update: (t, _dt) => {
      for (let i = 0; i < 12; i++) {
        curve.getPointAt((phase + t * 0.045 + i * 0.004) % 1, marker)
        matrix.makeTranslation(marker.x, marker.y, marker.z)
        markers.setMatrixAt(i, matrix)
      }
      markers.instanceMatrix.needsUpdate = true
      group.rotation.z = t * 0.2
      group.rotation.y = Math.sin(t * 0.33) * 0.15
    },
    dispose: () => {
      coilGeometry.dispose()
      shellGeometry.dispose()
      markerGeometry.dispose()
      coilMaterial.dispose()
      shellMaterial.dispose()
      markerMaterial.dispose()
    },
  }
}
