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
  return fract(sin(dot(p, vec2(127.31, 311.7)) + uSeed * 13.71) * 43758.5453);
}

float valueNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  vec2 curve = local * local * (3.0 - 2.0 * local);
  return mix(mix(hash21(cell), hash21(cell + vec2(1.0, 0.0)), curve.x),
    mix(hash21(cell + vec2(0.0, 1.0)), hash21(cell + 1.0), curve.x), curve.y);
}

float turbulence(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.55;
  for (int i = 0; i < 4; i++) {
    sum += abs(valueNoise(p) * 2.0 - 1.0) * amplitude;
    p = mat2(0.8, 0.6, -0.6, 0.8) * p * 2.05;
    amplitude *= 0.5;
  }
  return sum;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.16 + uSeed;
  vec2 p = uv * vec2(1.35, 2.0) + vec2(0.0, t * 0.18);
  float grain = turbulence(p * 1.1);
  float phase = p.x * 5.2 + grain * 5.8 + sin(p.y * 1.7 + t) * 0.42;
  float broadVein = pow(1.0 - abs(sin(phase)), 7.0);
  float fineVein = pow(1.0 - abs(sin(phase * 2.13 + grain * 2.2)), 14.0);
  float stone = 0.13 + 0.22 * valueNoise(p * 2.7);
  float glint = fineVein * (0.5 + 0.5 * sin(p.y * 9.0 - t * 2.0));

  vec3 col = mix(uColBg, uColSignal, stone + broadVein * 0.70);
  col = mix(col, uColPaper, fineVein * 0.32);
  col = mix(col, uColAccent, glint * 0.18);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
