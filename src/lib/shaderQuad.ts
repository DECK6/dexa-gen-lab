import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../types'

const VERT = /* glsl */ `
void main() {
  gl_Position = vec4(position, 1.0);
}
`

export interface ShaderQuad extends ThreeSketch {
  uniforms: Record<string, THREE.IUniform>
}

// Fullscreen fragment-shader runner for SHADER category sketches (SPEC §3).
// Injected uniforms: uTime (sec), uSeed, uRes, uColBg/uColSignal/uColAccent/uColPaper.
export function shaderQuad(
  ctx: SketchCtx,
  frag: string,
  extraUniforms: Record<string, THREE.IUniform> = {},
): ShaderQuad {
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const uniforms: Record<string, THREE.IUniform> = {
    uTime: { value: 0 },
    uSeed: { value: (ctx.seed % 1000) + ctx.random() },
    uRes: { value: new THREE.Vector2(ctx.width, ctx.height) },
    uColBg: { value: new THREE.Color(ctx.palette.bg) },
    uColSignal: { value: new THREE.Color(ctx.palette.signal) },
    uColAccent: { value: new THREE.Color(ctx.palette.accent) },
    uColPaper: { value: new THREE.Color(ctx.palette.paper) },
    ...extraUniforms,
  }

  const geo = new THREE.PlaneGeometry(2, 2)
  const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms })
  scene.add(new THREE.Mesh(geo, mat))

  return {
    scene,
    camera,
    uniforms,
    update(t) {
      uniforms.uTime!.value = t
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
