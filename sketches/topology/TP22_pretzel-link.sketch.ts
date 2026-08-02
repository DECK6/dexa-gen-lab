import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 13)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0, 7.2)
  const group = new THREE.Group()
  group.rotation.x = 0.24
  scene.add(group)
  const centers = [-1.3, 0, 1.3]
  const twists = [3, -4, 3]
  const positions: number[] = []
  const point = new THREE.Vector3()
  const tanglePoint = (box: number, side: number, s: number, out: THREE.Vector3): void => {
    const angle = twists[box] * Math.PI * s
    out.set(centers[box] + side * Math.cos(angle) * 0.25, (s - 0.5) * 2.7, side * Math.sin(angle) * 0.25)
  }
  const append = (a: THREE.Vector3, b: THREE.Vector3): void => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
  }
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const steps = 64
  for (let box = 0; box < 3; box++) {
    for (const side of [-1, 1]) {
      for (let i = 0; i < steps; i++) {
        tanglePoint(box, side, i / steps, a)
        tanglePoint(box, side, (i + 1) / steps, b)
        append(a, b)
      }
    }
  }
  const connect = (boxA: number, sideA: number, boxB: number, sideB: number, top: boolean): void => {
    tanglePoint(boxA, sideA, top ? 1 : 0, a)
    tanglePoint(boxB, sideB, top ? 1 : 0, b)
    const lift = top ? 0.52 : -0.52
    const depth = boxA === 2 ? 0.48 : -0.16
    const control = new THREE.Vector3((a.x + b.x) * 0.5, (a.y + b.y) * 0.5 + lift, depth)
    const previous = a.clone()
    for (let i = 1; i <= 28; i++) {
      const s = i / 28
      point.copy(a).multiplyScalar((1 - s) * (1 - s))
      point.addScaledVector(control, 2 * (1 - s) * s).addScaledVector(b, s * s)
      append(previous, point)
      previous.copy(point)
    }
  }
  for (let box = 0; box < 3; box++) {
    const next = (box + 1) % 3
    connect(box, 1, next, -1, true)
    connect(box, -1, next, 1, false)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const material = new THREE.LineBasicMaterial({ color: ctx.palette.signal })
  group.add(new THREE.LineSegments(geometry, material))
  const tracerPositions = new Float32Array(12 * 3)
  const tracerGeometry = new THREE.BufferGeometry()
  tracerGeometry.setAttribute('position', new THREE.BufferAttribute(tracerPositions, 3).setUsage(THREE.DynamicDrawUsage))
  const tracerMaterial = new THREE.PointsMaterial({ color: ctx.palette.accent, size: 0.085 })
  group.add(new THREE.Points(tracerGeometry, tracerMaterial))
  const phase = ctx.random()

  return {
    scene,
    camera,
    update: (t, _dt) => {
      for (let i = 0; i < 12; i++) {
        tanglePoint(i % 3, i % 2 === 0 ? -1 : 1, (phase + t * 0.09 + i / 12) % 1, point)
        tracerPositions[i * 3] = point.x
        tracerPositions[i * 3 + 1] = point.y
        tracerPositions[i * 3 + 2] = point.z
      }
      tracerGeometry.attributes.position.needsUpdate = true
      group.rotation.y = t * 0.17
      group.rotation.z = Math.sin(t * 0.33) * 0.1
    },
    dispose: () => {
      geometry.dispose()
      tracerGeometry.dispose()
      material.dispose()
      tracerMaterial.dispose()
    },
  }
}
