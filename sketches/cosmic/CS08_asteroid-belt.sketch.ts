import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const VARIANT = 8

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120)
  camera.position.set(0, 1.2, 8)

  const group = new THREE.Group()
  scene.add(group)
  const count = 1800 + VARIANT * 180
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const arm = i % (2 + (VARIANT % 5))
    const radius = Math.pow(ctx.random(), 0.62) * (3.2 + VARIANT * 0.12)
    const angle = radius * (1.3 + VARIANT * 0.09) + arm * Math.PI * 2 / (2 + (VARIANT % 5)) + (ctx.random() - 0.5) * 0.7
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = (ctx.random() - 0.5) * (0.45 + radius * 0.09)
    positions[i * 3 + 2] = Math.sin(angle) * radius
    sizes[i] = 0.5 + ctx.random()
  }
  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  const starMaterial = new THREE.PointsMaterial({
    color: ctx.palette.signal,
    size: 0.025 + VARIANT * 0.002,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
  })
  const stars = new THREE.Points(starGeometry, starMaterial)
  group.add(stars)

  const coreGeometry = VARIANT % 3 === 0
    ? new THREE.IcosahedronGeometry(0.62 + VARIANT * 0.025, 2)
    : VARIANT % 3 === 1
      ? new THREE.TorusGeometry(0.72 + VARIANT * 0.02, 0.16, 20, 80)
      : new THREE.SphereGeometry(0.58 + VARIANT * 0.025, 32, 24)
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: ctx.palette.accent,
    emissive: ctx.palette.accent,
    emissiveIntensity: 0.34,
    metalness: 0.15,
    roughness: 0.52,
    wireframe: false,
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)
  scene.add(new THREE.AmbientLight(ctx.palette.paper, 1.05))
  const light = new THREE.PointLight(ctx.palette.signal, 7, 18)
  light.position.set(2, 3, 4)
  scene.add(light)

  return {
    scene,
    camera,
    update: (t) => {
      group.rotation.y = t * (0.08 + VARIANT * 0.009)
      group.rotation.z = Math.sin(t * 0.17) * 0.18
      core.rotation.x = t * 0.36
      core.rotation.y = t * 0.24
      core.scale.setScalar(1 + Math.sin(t * 1.4 + VARIANT) * 0.08)
    },
    dispose: () => {
      starGeometry.dispose()
      starMaterial.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
    },
  }
}
