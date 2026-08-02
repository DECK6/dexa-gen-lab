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
  return fract(sin(dot(p, vec2(127.31, 311.7)) + uSeed * 10.17) * 43758.5453);
}

float density(vec3 p, float t) {
  vec3 q = p * 0.82 + vec3(t * 0.27, 0.0, -t * 0.15);
  float low = sin(q.x * 1.3 + sin(q.z * 0.8 + t));
  low += sin(q.y * 1.7 - q.z * 0.9 + t * 0.43);
  low += sin(dot(q, vec3(0.72, 1.11, 0.93)) - t * 0.57);
  float fine = sin(q.x * 2.7 - q.y * 1.9 + t * 0.81);
  fine += sin(q.z * 2.3 + q.y * 2.8 - t * 0.66);
  float densityField = 0.5 + low * 0.13 + fine * 0.065;
  float envelope = smoothstep(1.45, 0.25, abs(p.y));
  envelope *= smoothstep(4.6, 1.2, length(p.xz));
  return smoothstep(0.44, 0.69, densityField) * envelope;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.22 + uSeed;
  vec3 rayOrigin = vec3(0.0, 0.15, 3.6);
  vec3 rayDirection = normalize(vec3(uv, -1.35));
  float transmittance = 1.0;
  float volume = 0.0;
  float denseCore = 0.0;
  float travel = hash21(gl_FragCoord.xy) * 0.145;

  for (int i = 0; i < 44; i++) {
    vec3 position = rayOrigin + rayDirection * travel;
    float sampleDensity = density(position, t);
    float contribution = transmittance * sampleDensity * 0.14;
    volume += contribution;
    denseCore += contribution * sampleDensity;
    transmittance *= 1.0 - sampleDensity * 0.14;
    travel += 0.145;
    if (transmittance < 0.035) break;
  }

  float silhouette = clamp(volume, 0.0, 1.0);
  float highlight = clamp(denseCore * 1.6, 0.0, 1.0);
  float fringe = smoothstep(0.08, 0.34, silhouette) * (1.0 - smoothstep(0.52, 0.88, silhouette));
  vec3 col = mix(uColBg, uColSignal, silhouette * 0.86);
  col = mix(col, uColPaper, highlight * 0.26);
  col = mix(col, uColAccent, fringe * 0.16);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
