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
  p = fract(p * vec2(127.31, 311.7) + uSeed * 0.037);
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

// 5-octave fractal brownian motion with a rotation between octaves.
float fbm(vec2 p) {
  float s = 0.0;
  float amp = 0.5;
  mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    s += amp * vnoise(p);
    p = m * p * 2.03;
    amp *= 0.5;
  }
  return s;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.07 + uSeed;

  vec2 p = uv * 1.7;
  p.y -= t * 0.85;
  p += 0.22 * vec2(sin(p.y * 1.2 + t * 2.6), cos(p.x * 1.05 - t * 2.1));

  float base = fbm(p);
  float fine = fbm(p * 2.4 + 4.0);
  float dens = smoothstep(0.30, 0.86, base + fine * 0.24);
  float wisp = smoothstep(0.56, 0.95, fine) * dens;

  vec3 col = mix(uColBg, uColSignal, dens * 0.82);
  col = mix(col, uColPaper, pow(dens, 3.0) * 0.34);
  col = mix(col, uColAccent, wisp * 0.42);
  col *= 0.82 + 0.32 * (1.0 - clamp(length(uv) * 0.55, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
