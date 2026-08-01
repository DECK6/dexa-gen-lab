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

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdStar(vec2 p, float r) {
  float a = atan(p.y, p.x);
  return length(p) - r * (0.62 + 0.38 * cos(a * 5.0));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.4 + uSeed;
  vec2 p = rot(t * 0.45) * uv;

  float dC = sdCircle(p, 0.60);
  float dB = sdBox(p, vec2(0.48));
  float dS = sdStar(p, 0.72);

  // Cycle circle -> box -> star with an eased crossfade between stages.
  float ph = fract(t * 0.16) * 3.0;
  float stage = floor(ph);
  float k = fract(ph);
  float e = smoothstep(0.0, 1.0, smoothstep(0.15, 0.85, k));
  float a0 = stage < 0.5 ? dC : (stage < 1.5 ? dB : dS);
  float a1 = stage < 0.5 ? dB : (stage < 1.5 ? dS : dC);
  float d = mix(a0, a1, e);

  float fill = 1.0 - smoothstep(0.0, 0.014, d);
  float outline = 1.0 - smoothstep(0.005, 0.020, abs(d));
  float rings = smoothstep(0.42, 0.5, abs(fract(d * 9.0 - t * 0.7) - 0.5));
  rings *= smoothstep(0.95, 0.05, abs(d));

  vec3 col = mix(uColBg, uColSignal, fill * 0.28 + rings * 0.30);
  col = mix(col, uColSignal, outline * 0.85);
  col = mix(col, uColAccent, outline * (0.3 + 0.35 * sin(t * 2.4)));
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
