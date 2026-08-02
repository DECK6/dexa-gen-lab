import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 13)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0, 7)
  const group = new THREE.Group()
  group.rotation.x = 0.55
  scene.add(group)
  const word = [
    [0, 1, 1], [1, 2, -1], [0, 1, 1],
    [1, 2, -1], [0, 1, 1], [1, 2, -1],
  ] as const
  const material = new THREE.MeshBasicMaterial({ color: ctx.palette.signal })
  const geometries: THREE.BufferGeometry[] = []
  const curves: THREE.CatmullRomCurve3[] = []
  const steps = 32
  for (let component = 0; component < 3; component++) {
    const points: THREE.Vector3[] = []
    let slot = component
    for (let block = 0; block < word.length; block++) {
      const [low, high, sign] = word[block]
      for (let j = 0; j < steps; j++) {
        const q = j / steps
        const angle = ((block + q) / word.length) * Math.PI * 2
        let lane = slot - 1
        let height = 0
        if (slot === low || slot === high) {
          const middle = (low + high) / 2 - 1
          const direction = slot === low ? -1 : 1
          lane = middle + direction * Math.cos(q * Math.PI) * 0.5
          height = direction * sign * Math.sin(q * Math.PI) * 0.34
        }
        const radius = 1.52 + lane * 0.3
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, height))
      }
      if (slot === low) slot = high
      else if (slot === high) slot = low
    }
    const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal')
    const geometry = new THREE.TubeGeometry(curve, 240, 0.055, 6, true)
    group.add(new THREE.Mesh(geometry, material))
    curves.push(curve)
    geometries.push(geometry)
  }
  const markerGeometry = new THREE.SphereGeometry(0.095, 7, 5)
  const markerMaterial = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const markers = new THREE.InstancedMesh(markerGeometry, markerMaterial, 3)
  group.add(markers)
  const marker = new THREE.Vector3()
  const matrix = new THREE.Matrix4()
  const phase = ctx.random()

  return {
    scene,
    camera,
    update: (t, _dt) => {
      for (let i = 0; i < 3; i++) {
        curves[i].getPointAt((phase + t * 0.06 + i / 3) % 1, marker)
        matrix.makeTranslation(marker.x, marker.y, marker.z)
        markers.setMatrixAt(i, matrix)
      }
      markers.instanceMatrix.needsUpdate = true
      group.rotation.z = t * 0.17
      group.rotation.y = Math.sin(t * 0.29) * 0.18
    },
    dispose: () => {
      for (const geometry of geometries) geometry.dispose()
      markerGeometry.dispose()
      material.dispose()
      markerMaterial.dispose()
    },
  }
}
