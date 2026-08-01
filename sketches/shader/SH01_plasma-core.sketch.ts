import type { SketchCtx, ThreeSketch } from '../../src/types'
import { shaderQuad } from '../../src/lib/shaderQuad'

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uSeed;
uniform vec2 uRes;
uniform vec3 uColBg;
uniform vec3 uColSignal;
uniform vec3 uColAccent;

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.6 + uSeed;
  float v = sin(uv.x * 3.0 + t)
          + sin(uv.y * 3.4 - t * 1.2)
          + sin((uv.x + uv.y) * 2.2 + t * 0.7)
          + sin(length(uv) * 5.0 - t * 1.5);
  float n = v * 0.25 + 0.5;
  vec3 col = mix(uColBg, uColSignal, smoothstep(0.15, 0.95, n));
  col = mix(col, uColAccent, smoothstep(0.82, 1.0, n) * 0.6);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
