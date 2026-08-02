import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 6, 13)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 100)
  camera.position.set(0, 0, 6.8)
  const primalGroup = new THREE.Group()
  const dualGroup = new THREE.Group()
  scene.add(primalGroup, dualGroup)
  const primalBase = new THREE.IcosahedronGeometry(1.58, 0)
  const dualBase = new THREE.DodecahedronGeometry(1.62, 0)
  const primalGeometry = new THREE.EdgesGeometry(primalBase)
  const dualGeometry = new THREE.EdgesGeometry(dualBase)
  const primalMaterial = new THREE.LineBasicMaterial({ color: ctx.palette.signal, transparent: true, opacity: 0.9 })
  const dualMaterial = new THREE.LineBasicMaterial({ color: ctx.palette.dim, transparent: true, opacity: 0.72 })
  primalGroup.add(new THREE.LineSegments(primalGeometry, primalMaterial))
  dualGroup.add(new THREE.LineSegments(dualGeometry, dualMaterial))
  const vertexMaterial = new THREE.PointsMaterial({ color: ctx.palette.accent, size: 0.055 })
  dualGroup.add(new THREE.Points(dualBase, vertexMaterial))
  const phase = ctx.random() * Math.PI * 2

  return {
    scene,
    camera,
    update: (t, _dt) => {
      primalGroup.rotation.set(t * 0.14, t * 0.21, Math.sin(t * 0.31 + phase) * 0.12)
      dualGroup.rotation.set(-t * 0.11, -t * 0.18, Math.cos(t * 0.27 + phase) * 0.16)
      dualGroup.scale.setScalar(0.94 + Math.sin(t * 0.66 + phase) * 0.08)
    },
    dispose: () => {
      primalBase.dispose()
      dualBase.dispose()
      primalGeometry.dispose()
      dualGeometry.dispose()
      primalMaterial.dispose()
      dualMaterial.dispose()
      vertexMaterial.dispose()
    },
  }
}
