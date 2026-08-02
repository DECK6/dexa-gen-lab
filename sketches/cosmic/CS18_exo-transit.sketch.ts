import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

const SAMPLES = 128

function flux(x: number): number {
  return 1 - 0.42 * Math.exp(-Math.pow(x * 2.4, 8))
}

export function sketch(ctx: SketchCtx): ThreeSketch {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(ctx.palette.bg)
  scene.fog = new THREE.Fog(ctx.palette.bg, 8, 18)
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 30)
  camera.position.set(0, 0, 9)
  camera.lookAt(0, 0, 0)

  const starGeo = new THREE.SphereGeometry(1.48, 32, 24)
  const starMat = new THREE.MeshBasicMaterial({ color: ctx.palette.signal })
  const star = new THREE.Mesh(starGeo, starMat)
  star.position.y = 0.75
  scene.add(star)
  const planetGeo = new THREE.SphereGeometry(0.38, 20, 14)
  const planetMat = new THREE.MeshBasicMaterial({ color: ctx.palette.ink })
  const planet = new THREE.Mesh(planetGeo, planetMat)
  scene.add(planet)

  const curvePos = new Float32Array(SAMPLES * 3)
  for (let i = 0; i < SAMPLES; i++) {
    const x = i / (SAMPLES - 1) * 7 - 3.5
    curvePos[i * 3] = x
    curvePos[i * 3 + 1] = -2.55 + flux(x / 3.5) * 0.9
    curvePos[i * 3 + 2] = 0
  }
  const curveGeo = new THREE.BufferGeometry()
  curveGeo.setAttribute('position', new THREE.BufferAttribute(curvePos, 3))
  const curveMat = new THREE.LineBasicMaterial({ color: ctx.palette.paper, transparent: true, opacity: 0.8 })
  scene.add(new THREE.Line(curveGeo, curveMat))
  const markerGeo = new THREE.OctahedronGeometry(0.1, 0)
  const markerMat = new THREE.MeshBasicMaterial({ color: ctx.palette.accent })
  const marker = new THREE.Mesh(markerGeo, markerMat)
  scene.add(marker)

  return {
    scene,
    camera,
    update(t, _dt) {
      const cycle = (t * 0.16 + 0.12) % 1
      const x = cycle * 7 - 3.5
      planet.position.set(x, 0.75 + Math.sin(t * 0.7) * 0.08, 1.25)
      marker.position.set(x, -2.55 + flux(x / 3.5) * 0.9, 0.05)
      star.scale.setScalar(1 + Math.sin(t * 1.8) * 0.018)
    },
    dispose() {
      starGeo.dispose()
      starMat.dispose()
      planetGeo.dispose()
      planetMat.dispose()
      curveGeo.dispose()
      curveMat.dispose()
      markerGeo.dispose()
      markerMat.dispose()
    },
  }
}
