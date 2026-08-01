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

float hash21(vec2 p) {
  p = fract(p * vec2(127.31, 311.7) + uSeed * 0.041);
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
    p = m * p * 2.07;
    amp *= 0.5;
  }
  return s;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.3 + uSeed;

  float r = length(uv);
  float a = atan(uv.y, uv.x) + t * 0.35;

  // Fold the angle into a single wedge -> 6-fold mirrored symmetry.
  float seg = 6.2831853 / 6.0;
  a = abs(mod(a, seg) - seg * 0.5);

  vec2 p = vec2(cos(a), sin(a)) * r * 2.5;
  p += 0.4 * vec2(sin(t * 1.05), cos(t * 0.85));

  float f = fbm(p);
  float g = fbm(p * 1.9 + f * 1.5);
  float v = smoothstep(0.44, 0.94, f + g * 0.35);
  float edge = smoothstep(0.42, 0.5, abs(fract(g * 4.5 - t * 0.6) - 0.5));

  vec3 col = mix(uColBg, uColSignal, v * 0.88);
  col = mix(col, uColAccent, edge * v * 0.55);
  col *= 0.15 + 0.85 * smoothstep(1.5, 0.15, r);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
