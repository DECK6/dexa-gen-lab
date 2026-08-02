import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const SATELLITES = 36
const MAX_LINKS = (SATELLITES * (SATELLITES - 1)) / 2

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 9, 25)
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 60)

  const orbit = new Float32Array(SATELLITES * 5)
  const satPos = new Float32Array(SATELLITES * 3)
  const satCol = new Float32Array(SATELLITES * 3)
  const signal = new THREE.Color(pal.signal)
  const accent = new THREE.Color(pal.accent)
  for (let i = 0; i < SATELLITES; i++) {
    const k = i * 5
    orbit[k] = 3 + ctx.random() * 4.5
    orbit[k + 1] = (ctx.random() - 0.5) * Math.PI
    orbit[k + 2] = ctx.random() * Math.PI * 2
    orbit[k + 3] = ctx.random() * Math.PI * 2
    orbit[k + 4] = 0.22 + ctx.random() * 0.28
    const c = i % 11 === 0 ? accent : signal
    satCol[i * 3] = c.r
    satCol[i * 3 + 1] = c.g
    satCol[i * 3 + 2] = c.b
  }
  const satGeo = new THREE.BufferGeometry()
  const satAttr = new THREE.BufferAttribute(satPos, 3)
  satAttr.setUsage(THREE.DynamicDrawUsage)
  satGeo.setAttribute('position', satAttr)
  satGeo.setAttribute('color', new THREE.BufferAttribute(satCol, 3))
  const satMat = new THREE.PointsMaterial({ size: 0.24, vertexColors: true, sizeAttenuation: true })
  scene.add(new THREE.Points(satGeo, satMat))

  const linkPos = new Float32Array(MAX_LINKS * 6)
  const linkGeo = new THREE.BufferGeometry()
  const linkAttr = new THREE.BufferAttribute(linkPos, 3)
  linkAttr.setUsage(THREE.DynamicDrawUsage)
  linkGeo.setAttribute('position', linkAttr)
  const linkMat = new THREE.LineBasicMaterial({ color: signal, transparent: true, opacity: 0.32 })
  scene.add(new THREE.LineSegments(linkGeo, linkMat))
  const globeGeo = new THREE.IcosahedronGeometry(1.2, 1)
  const globeMat = new THREE.MeshBasicMaterial({ color: accent, wireframe: true })
  scene.add(new THREE.Mesh(globeGeo, globeMat))

  function network(t: number) {
    for (let i = 0; i < SATELLITES; i++) {
      const k = i * 5
      const r = orbit[k]!
      const a = orbit[k + 3]! + t * orbit[k + 4]! / Math.sqrt(r)
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      const inc = orbit[k + 1]!
      const node = orbit[k + 2]!
      const j = i * 3
      satPos[j] = x * Math.cos(node) + z * Math.cos(inc) * Math.sin(node)
      satPos[j + 1] = -z * Math.sin(inc)
      satPos[j + 2] = -x * Math.sin(node) + z * Math.cos(inc) * Math.cos(node)
    }
    let used = 0
    for (let i = 0; i < SATELLITES; i++) {
      for (let j = i + 1; j < SATELLITES; j++) {
        const a = i * 3
        const b = j * 3
        const dx = satPos[b]! - satPos[a]!
        const dy = satPos[b + 1]! - satPos[a + 1]!
        const dz = satPos[b + 2]! - satPos[a + 2]!
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 < 1e-8) continue
        const q = Math.min(1, Math.max(0, -(satPos[a]! * dx + satPos[a + 1]! * dy + satPos[a + 2]! * dz) / d2))
        const cx = satPos[a]! + dx * q
        const cy = satPos[a + 1]! + dy * q
        const cz = satPos[a + 2]! + dz * q
        if (d2 > 25 || cx * cx + cy * cy + cz * cz < 1.7 || Math.sin(t * 1.4 + i * 0.73 + j * 0.39) < -0.2) continue
        const k = used * 6
        linkPos[k] = satPos[a]!
        linkPos[k + 1] = satPos[a + 1]!
        linkPos[k + 2] = satPos[a + 2]!
        linkPos[k + 3] = satPos[b]!
        linkPos[k + 4] = satPos[b + 1]!
        linkPos[k + 5] = satPos[b + 2]!
        used++
      }
    }
    satAttr.needsUpdate = true
    linkAttr.needsUpdate = true
    linkGeo.setDrawRange(0, used * 2)
  }
  network(0)

  return {
    scene,
    camera,
    update(t) {
      network(t)
      camera.position.set(Math.cos(t * 0.1) * 14, 7, Math.sin(t * 0.1) * 14)
      camera.lookAt(0, 0, 0)
    },
    dispose() {
      satGeo.dispose()
      satMat.dispose()
      linkGeo.dispose()
      linkMat.dispose()
      globeGeo.dispose()
      globeMat.dispose()
    },
  }
}
