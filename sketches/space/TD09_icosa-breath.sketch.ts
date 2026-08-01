import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const R = 2.6

function lobes(x: number, y: number, z: number): number {
  return (
    Math.sin(x * 2.1 + Math.cos(y * 1.7)) * Math.cos(z * 1.9 - Math.sin(y * 1.3)) * 0.7 +
    Math.sin(y * 3.3 + z * 2.7) * 0.3
  )
}

export function sketch(ctx: SketchCtx): ThreeSketch {
  const pal = ctx.palette
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(pal.bg)
  scene.fog = new THREE.Fog(pal.bg, 7, 20)

  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 60)
  camera.position.set(0, 0, 10)

  const geo = new THREE.IcosahedronGeometry(R, 3)
  const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
  const pos = posAttr.array as Float32Array
  const vcount = posAttr.count
  const dir = new Float32Array(vcount * 3)
  for (let i = 0; i < vcount * 3; i++) dir[i] = pos[i]! / R
  posAttr.setUsage(THREE.DynamicDrawUsage)

  const skinMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(pal.bg) })
  const skin = new THREE.Mesh(geo, skinMat)
  skin.scale.setScalar(0.985)
  const wireMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(pal.signal), wireframe: true })
  const wire = new THREE.Mesh(geo, wireMat)

  const coreGeo = new THREE.IcosahedronGeometry(0.75, 0)
  const coreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(pal.accent), wireframe: true })
  const core = new THREE.Mesh(coreGeo, coreMat)

  const shell = new THREE.Group()
  shell.add(skin, wire)
  scene.add(shell, core)

  const phase = ctx.random() * Math.PI * 2

  return {
    scene,
    camera,
    update(t) {
      const breath = Math.sin(t * 0.75 + phase)
      for (let i = 0; i < vcount; i++) {
        const j = i * 3
        const dx = dir[j]!
        const dy = dir[j + 1]!
        const dz = dir[j + 2]!
        const n = lobes(dx * 2.2 + t * 0.2, dy * 2.2 - t * 0.13, dz * 2.2)
        const rad = R * (1 + breath * 0.08) + n * (0.35 + breath * 0.45)
        pos[j] = dx * rad
        pos[j + 1] = dy * rad
        pos[j + 2] = dz * rad
      }
      posAttr.needsUpdate = true
      shell.rotation.y = t * 0.17
      shell.rotation.x = Math.sin(t * 0.12) * 0.4
      core.rotation.y = -t * 0.44
      core.rotation.z = t * 0.29
      core.scale.setScalar(1 + breath * 0.22)
    },
    dispose() {
      geo.dispose()
      skinMat.dispose()
      wireMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
    },
  }
}
