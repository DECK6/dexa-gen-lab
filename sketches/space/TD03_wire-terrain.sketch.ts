import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const NX = 52
const NZ = 56
const STEP = 0.66
const SPEED = 3.2
const CREST_ROW = 44 // near-camera row drawn as the accent elevation cursor

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 6, 30)

  const camera = new THREE.PerspectiveCamera(52, ctx.width / ctx.height, 0.1, 80)

  const ox = ctx.random() * 120
  const oz = ctx.random() * 120

  function height(x: number, z: number): number {
    const a = Math.sin(x * 0.24 + ox) * Math.cos(z * 0.19 + oz)
    const b = Math.sin(x * 0.51 - z * 0.37 + oz) * 0.5
    const c = Math.cos(x * 0.93 + z * 0.81) * 0.22
    return (a + b + c) * 1.35
  }

  const pos = new Float32Array(NX * NZ * 3)
  const idx: number[] = []
  for (let iz = 0; iz < NZ; iz++) {
    for (let ix = 0; ix < NX; ix++) {
      const v = iz * NX + ix
      if (ix < NX - 1) idx.push(v, v + 1)
      if (iz < NZ - 1) idx.push(v, v + NX)
    }
  }
  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('position', posAttr)
  geo.setIndex(idx)
  const mat = new THREE.LineBasicMaterial({ color: new THREE.Color(pal.signal) })
  const grid = new THREE.LineSegments(geo, mat)
  scene.add(grid)

  const crestPos = new Float32Array(NX * 3)
  const crestGeo = new THREE.BufferGeometry()
  const crestAttr = new THREE.BufferAttribute(crestPos, 3)
  crestAttr.setUsage(THREE.DynamicDrawUsage)
  crestGeo.setAttribute('position', crestAttr)
  const crestMat = new THREE.LineBasicMaterial({ color: new THREE.Color(pal.accent) })
  scene.add(new THREE.Line(crestGeo, crestMat))

  function build(t: number) {
    const scroll = t * SPEED
    const shift = Math.floor(scroll / STEP)
    const frac = scroll - shift * STEP
    for (let iz = 0; iz < NZ; iz++) {
      // sampleZ walks the static landscape; localZ slides smoothly toward the camera
      const sampleZ = -(iz + shift) * STEP
      const localZ = -iz * STEP + frac
      for (let ix = 0; ix < NX; ix++) {
        const x = (ix - NX / 2 + 0.5) * STEP
        const j = (iz * NX + ix) * 3
        pos[j] = x
        pos[j + 1] = height(x, sampleZ)
        pos[j + 2] = localZ
        if (iz === CREST_ROW) {
          const k = ix * 3
          crestPos[k] = x
          crestPos[k + 1] = pos[j + 1] + 0.12
          crestPos[k + 2] = localZ
        }
      }
    }
    posAttr.needsUpdate = true
    crestAttr.needsUpdate = true
  }
  build(0)

  return {
    scene,
    camera,
    update(t) {
      build(t)
      camera.position.set(Math.sin(t * 0.21) * 2.2, 4.6 + Math.sin(t * 0.33) * 0.4, 3.4)
      camera.lookAt(Math.sin(t * 0.21) * 1.2, 1.2, -14)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      crestGeo.dispose()
      crestMat.dispose()
    },
  }
}
