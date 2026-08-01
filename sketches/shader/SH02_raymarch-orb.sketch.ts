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

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
  float t = uTime * 0.5 + uSeed;
  vec3 q = p;
  q.xz = rot(t * 0.55) * q.xz;
  q.xy = rot(t * 0.31) * q.xy;
  float sphere = length(q - vec3(0.0, sin(t) * 0.22, 0.0)) - 0.62;
  vec2 tq = vec2(length(q.xz) - 0.94, q.y);
  float torus = length(tq) - 0.21;
  float k = 0.32 + 0.26 * sin(t * 0.8);
  return smin(sphere, torus, k);
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0018, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  vec3 ro = vec3(0.0, 0.0, 3.2);
  vec3 rd = normalize(vec3(uv, -1.75));

  float d = 0.0;
  float hit = 0.0;
  for (int i = 0; i < 64; i++) {
    float s = map(ro + rd * d);
    if (s < 0.0015) { hit = 1.0; break; }
    d += s;
    if (d > 7.0) break;
  }

  vec3 col = mix(uColBg, uColSignal, 0.05 * (1.0 - clamp(length(uv) * 0.6, 0.0, 1.0)));
  if (hit > 0.5) {
    vec3 p = ro + rd * d;
    vec3 n = calcNormal(p);
    vec3 l = normalize(vec3(0.55, 0.8, 0.65));
    float dif = clamp(dot(n, l), 0.0, 1.0);
    float rim = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 2.5);
    float spec = pow(clamp(dot(reflect(-l, n), -rd), 0.0, 1.0), 26.0);
    col = mix(uColBg, uColSignal, 0.22 + 0.72 * dif);
    col = mix(col, uColAccent, rim * 0.55 + spec * 0.4);
    col *= 1.0 - smoothstep(2.7, 5.5, d) * 0.55;
  }
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
