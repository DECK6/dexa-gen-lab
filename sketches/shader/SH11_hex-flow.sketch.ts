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

vec4 hexCell(vec2 p) {
  vec2 size = vec2(1.0, 1.7320508);
  vec2 a = mod(p, size) - 0.5 * size;
  vec2 b = mod(p - 0.5 * size, size) - 0.5 * size;
  return dot(a, a) < dot(b, b) ? vec4(a, p - a) : vec4(b, p - b);
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17)) + uSeed * 7.13) * 43758.5453);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.55 + uSeed;
  vec2 p = uv * 4.2 + vec2(t * 0.32, sin(t * 0.3) * 0.18);
  vec4 cell = hexCell(p);
  vec2 local = cell.xy;
  vec2 id = cell.zw;

  float edgeDistance = max(dot(abs(local), vec2(0.5, 0.8660254)), abs(local.y));
  float border = smoothstep(0.40, 0.48, edgeDistance);
  float lane = 1.0 - smoothstep(0.04, 0.12, abs(local.y + local.x * 0.58));
  float phase = fract(id.x * 0.173 + id.y * 0.097 - t * 0.42);
  float packet = exp(-abs(phase - 0.5) * 13.0);
  float tilePulse = 0.18 + 0.24 * (0.5 + 0.5 * sin(t * 1.8 + id.x * 2.1 - id.y));
  float marked = step(0.82, hash21(id));

  vec3 col = mix(uColBg, uColSignal, border * 0.72 + tilePulse * (1.0 - border));
  col = mix(col, uColSignal, lane * packet * 0.82);
  col = mix(col, uColAccent, marked * packet * (0.25 + lane * 0.55));
  col = mix(col, uColPaper, border * packet * 0.18);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
