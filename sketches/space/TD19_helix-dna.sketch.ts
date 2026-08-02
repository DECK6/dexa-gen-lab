import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const RUNGS = 90
const RISE = 0.16
const HEIGHT = RUNGS * RISE
const TURN = (Math.PI * 2 * 6) / RUNGS

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 7, 23)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 60)

  const nodes = new Float32Array(RUNGS * 2 * 3)
  const segments = (RUNGS - 1) * 2 + RUNGS
  const lines = new Float32Array(segments * 6)
  const colors = new Float32Array(lines.length)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  const dim = new THREE.Color(pal.dim)
  let segment = 0
  for (let strand = 0; strand < 2; strand++) {
    for (let i = 0; i < RUNGS - 1; i++) {
      const k = segment++ * 6
      colors.set([signal.r, signal.g, signal.b, signal.r, signal.g, signal.b], k)
    }
  }
  for (let i = 0; i < RUNGS; i++) {
    const c = i % 12 === 0 ? accent : dim
    const k = segment++ * 6
    colors.set([c.r, c.g, c.b, c.r, c.g, c.b], k)
  }
  const lineGeo = new THREE.BufferGeometry()
  const lineAttr = new THREE.BufferAttribute(lines, 3)
  lineAttr.setUsage(THREE.DynamicDrawUsage)
  lineGeo.setAttribute('position', lineAttr)
  lineGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const lineMat = new THREE.LineBasicMaterial({ vertexColors: true })
  const helix = new THREE.LineSegments(lineGeo, lineMat)

  const pointGeo = new THREE.BufferGeometry()
  const pointAttr = new THREE.BufferAttribute(nodes, 3)
  pointAttr.setUsage(THREE.DynamicDrawUsage)
  pointGeo.setAttribute('position', pointAttr)
  const pointMat = new THREE.PointsMaterial({ color: signal, size: 0.12, sizeAttenuation: true })
  const group = new THREE.Group()
  group.add(helix, new THREE.Points(pointGeo, pointMat))
  scene.add(group)
  const phase = ctx.random() * Math.PI * 2

  function build(t: number) {
    const travel = t * 0.82
    for (let i = 0; i < RUNGS; i++) {
      const a = (i + travel / RISE) * TURN + phase
      const y = ((i * RISE + travel) % HEIGHT) - HEIGHT / 2
      for (let strand = 0; strand < 2; strand++) {
        const j = (strand * RUNGS + i) * 3
        const side = strand * Math.PI
        nodes[j] = Math.cos(a + side) * 2.1
        nodes[j + 1] = y
        nodes[j + 2] = Math.sin(a + side) * 2.1
      }
    }
    let at = 0
    for (let strand = 0; strand < 2; strand++) {
      for (let i = 0; i < RUNGS - 1; i++) {
        const a = (strand * RUNGS + i) * 3
        lines[at] = nodes[a]!
        lines[at + 1] = nodes[a + 1]!
        lines[at + 2] = nodes[a + 2]!
        lines[at + 3] = nodes[a + 3]!
        lines[at + 4] = nodes[a + 4]!
        lines[at + 5] = nodes[a + 5]!
        at += 6
      }
    }
    for (let i = 0; i < RUNGS; i++) {
      const a = i * 3
      const b = (RUNGS + i) * 3
      lines[at] = nodes[a]!
      lines[at + 1] = nodes[a + 1]!
      lines[at + 2] = nodes[a + 2]!
      lines[at + 3] = nodes[b]!
      lines[at + 4] = nodes[b + 1]!
      lines[at + 5] = nodes[b + 2]!
      at += 6
    }
    pointAttr.needsUpdate = true
    lineAttr.needsUpdate = true
  }
  build(0)

  return {
    scene,
    camera,
    update(t) {
      build(t)
      group.rotation.y = t * 0.18
      camera.position.set(Math.cos(t * 0.08) * 10, 1.5, Math.sin(t * 0.08) * 10)
      camera.lookAt(0, 0.8, 0)
    },
    dispose() {
      lineGeo.dispose()
      lineMat.dispose()
      pointGeo.dispose()
      pointMat.dispose()
    },
  }
}
