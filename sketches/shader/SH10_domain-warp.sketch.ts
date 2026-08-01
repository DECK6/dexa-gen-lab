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
uniform vec3 uColPaper;

float hash21(vec2 p) {
  p = fract(p * vec2(127.31, 311.7) + uSeed * 0.029);
  p += dot(p, p + 34.19);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0;
  float amp = 0.5;
  mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    s += amp * vnoise(p);
    p = m * p * 2.05;
    amp *= 0.5;
  }
  return s;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.1 + uSeed;
  vec2 p = uv * 1.5;

  // Two nested warps: q displaces p, r displaces the already-warped field.
  vec2 q = vec2(
    fbm(p + vec2(0.0, t)),
    fbm(p + vec2(5.2, 1.3) - t * 0.7));
  vec2 r = vec2(
    fbm(p + 3.4 * q + vec2(1.7, 9.2) + t * 1.1),
    fbm(p + 3.4 * q + vec2(8.3, 2.8) - t * 0.8));
  float f = fbm(p + 3.0 * r);

  float v = smoothstep(0.36, 0.95, f * 1.3);
  vec3 col = mix(uColBg, uColSignal, v * 0.95);
  col = mix(col, uColAccent, smoothstep(0.35, 0.95, dot(q, q)) * 0.6);
  col = mix(col, uColPaper, smoothstep(0.45, 0.95, r.x) * 0.24);
  col *= 0.7 + 0.4 * f;
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
