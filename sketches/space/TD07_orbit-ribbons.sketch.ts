import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const ORBITS = 7
const SEG = 200

// One closed ribbon around the origin, twisting between radial and vertical.
function ribbonGeo(radius: number, twist: number, halfW: number): THREE.BufferGeometry {
  const pos = new Float32Array((SEG + 1) * 2 * 3)
  const idx: number[] = []
  for (let i = 0; i <= SEG; i++) {
    const a = (i / SEG) * Math.PI * 2
    const ca = Math.cos(a)
    const sa = Math.sin(a)
    const wr = Math.cos(twist * a) * halfW
    const wy = Math.sin(twist * a) * halfW
    const k = i * 6
    pos[k] = (radius + wr) * ca
    pos[k + 1] = wy
    pos[k + 2] = (radius + wr) * sa
    pos[k + 3] = (radius - wr) * ca
    pos[k + 4] = -wy
    pos[k + 5] = (radius - wr) * sa
    if (i < SEG) {
      const b = i * 2
      idx.push(b, b + 1, b + 3, b, b + 3, b + 2)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setIndex(idx)
  return g
}

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 12, 40)

  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 100)

  const matSignal = new THREE.MeshBasicMaterial({
    color: new THREE.Color(pal.signal),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.55,
  })
  const matAccent = new THREE.MeshBasicMaterial({
    color: new THREE.Color(pal.accent),
    side: THREE.DoubleSide,
  })
  const beadGeo = new THREE.OctahedronGeometry(0.16, 0)
  const geos: THREE.BufferGeometry[] = []

  interface Orbit {
    node: THREE.Object3D
    tilt: THREE.Object3D
    bead: THREE.Mesh
    radius: number
    nodeRate: number
    tiltBase: number
    tiltRate: number
    orbitRate: number
    phase: number
  }
  const orbits: Orbit[] = []

  for (let i = 0; i < ORBITS; i++) {
    const radius = 3 + i * 0.9 + ctx.random() * 0.4
    const geo = ribbonGeo(radius, 1 + Math.floor(ctx.random() * 3), 0.18)
    geos.push(geo)
    const node = new THREE.Object3D()
    const tilt = new THREE.Object3D()
    tilt.add(new THREE.Mesh(geo, i === ORBITS - 2 ? matAccent : matSignal))
    const bead = new THREE.Mesh(beadGeo, matAccent)
    tilt.add(bead)
    node.add(tilt)
    scene.add(node)
    orbits.push({
      node,
      tilt,
      bead,
      radius,
      nodeRate: 0.07 + ctx.random() * 0.16,
      tiltBase: (ctx.random() - 0.5) * 1.5,
      tiltRate: 0.05 + ctx.random() * 0.13,
      orbitRate: 0.9 / (0.4 + radius * 0.22),
      phase: ctx.random() * Math.PI * 2,
    })
  }

  return {
    scene,
    camera,
    update(t) {
      for (const o of orbits) {
        o.node.rotation.y = t * o.nodeRate + o.phase
        o.tilt.rotation.x = o.tiltBase + Math.sin(t * o.tiltRate) * 0.45
        const a = t * o.orbitRate + o.phase
        o.bead.position.set(Math.cos(a) * o.radius, 0, Math.sin(a) * o.radius)
      }
      const r = 20
      camera.position.set(Math.cos(t * 0.06) * r, 7 + Math.sin(t * 0.11) * 4, Math.sin(t * 0.06) * r)
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      for (const g of geos) g.dispose()
      beadGeo.dispose()
      matSignal.dispose()
      matAccent.dispose()
    },
  }
}
