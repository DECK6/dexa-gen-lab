import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const RADIUS = 3.5

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 7, 20)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 50)
  camera.position.set(0, 0, 11)

  const sourceGeo = new THREE.IcosahedronGeometry(RADIUS, 2)
  const wireGeo = new THREE.WireframeGeometry(sourceGeo)
  sourceGeo.dispose()
  const posAttr = wireGeo.getAttribute('position') as THREE.BufferAttribute
  const pos = posAttr.array as Float32Array
  const base = pos.slice()
  const tangent = new Float32Array(pos.length)
  const col = new Float32Array(pos.length)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  for (let i = 0; i < posAttr.count; i++) {
    const j = i * 3
    const x = base[j]! / RADIUS
    const y = base[j + 1]! / RADIUS
    const z = base[j + 2]! / RADIUS
    const mag = Math.hypot(z, x)
    tangent[j] = mag > 1e-5 ? z / mag : 1
    tangent[j + 1] = 0
    tangent[j + 2] = mag > 1e-5 ? -x / mag : 0
    const c = i % 53 < 2 ? accent : signal
    col[j] = c.r
    col[j + 1] = c.g
    col[j + 2] = c.b
    base[j] = x
    base[j + 1] = y
    base[j + 2] = z
  }
  posAttr.setUsage(THREE.DynamicDrawUsage)
  wireGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.LineBasicMaterial({ vertexColors: true })
  const net = new THREE.LineSegments(wireGeo, mat)
  scene.add(net)
  const phase = ctx.random() * Math.PI * 2

  return {
    scene,
    camera,
    update(t) {
      const inversion = (1 - Math.cos(t * 0.62 + phase)) * 0.5
      const c = Math.cos(inversion * Math.PI)
      const s = Math.sin(inversion * Math.PI)
      for (let i = 0; i < posAttr.count; i++) {
        const j = i * 3
        pos[j] = (base[j]! * c + tangent[j]! * s) * RADIUS
        pos[j + 1] = (base[j + 1]! * c + tangent[j + 1]! * s) * RADIUS
        pos[j + 2] = (base[j + 2]! * c + tangent[j + 2]! * s) * RADIUS
      }
      posAttr.needsUpdate = true
      net.rotation.y = t * 0.12
      net.rotation.x = Math.sin(t * 0.17) * 0.25
    },
    dispose() {
      wireGeo.dispose()
      mat.dispose()
    },
  }
}
