import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const COUNT = 240

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 8, 18)
  const camera = new THREE.PerspectiveCamera(44, ctx.width / ctx.height, 0.1, 40)
  camera.position.set(0, 1.6, 9)
  camera.lookAt(0, 0, 0)

  const panelGeo = new THREE.BoxGeometry(0.32, 0.16, 0.035)
  const panelMat = new THREE.MeshBasicMaterial({ color: ctx.palette.signal })
  const panels = new THREE.InstancedMesh(panelGeo, panelMat, COUNT)
  panels.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  const group = new THREE.Group()
  group.add(panels)
  scene.add(group)
  const directions = new Float32Array(COUNT * 3)
  const order = new Float32Array(COUNT)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i + 0.5) / COUNT * 2
    const r = Math.sqrt(1 - y * y)
    const a = i * golden
    directions[i * 3] = Math.cos(a) * r
    directions[i * 3 + 1] = y
    directions[i * 3 + 2] = Math.sin(a) * r
    order[i] = (i / COUNT + ctx.random() * 0.12) % 1
  }
  const starGeo = new THREE.IcosahedronGeometry(0.82, 3)
  const starMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent, wireframe: true })
  const star = new THREE.Mesh(starGeo, starMat)
  scene.add(star)
  const dummy = new THREE.Object3D()
  const normal = new THREE.Vector3(0, 0, 1)
  const direction = new THREE.Vector3()
  const rotation = new THREE.Quaternion()

  return {
    scene,
    camera,
    update(t, _dt) {
      const cycle = (0.55 + t * 0.06) % 1
      for (let i = 0; i < COUNT; i++) {
        const k = i * 3
        direction.set(directions[k], directions[k + 1], directions[k + 2])
        const radius = 3 + Math.sin(t * 0.7 + i * 0.31) * 0.045
        dummy.position.copy(direction).multiplyScalar(radius)
        rotation.setFromUnitVectors(normal, direction)
        dummy.quaternion.copy(rotation)
        const phase = (cycle - order[i] + 1) % 1
        const reveal = Math.min(phase * 18, 1) * Math.min((1 - phase) * 18, 1)
        dummy.scale.setScalar(Math.max(0.025, reveal))
        dummy.updateMatrix()
        panels.setMatrixAt(i, dummy.matrix)
      }
      panels.instanceMatrix.needsUpdate = true
      group.rotation.y = t * 0.12
      group.rotation.z = Math.sin(t * 0.17) * 0.18
      star.rotation.y = t * 0.55
      star.scale.setScalar(1 + Math.sin(t * 2.8) * 0.08)
    },
    dispose() {
      panelGeo.dispose()
      panelMat.dispose()
      starGeo.dispose()
      starMat.dispose()
    },
  }
}
