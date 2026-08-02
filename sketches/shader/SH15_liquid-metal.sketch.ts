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

float hash11(float p) {
  return fract(sin(p * 119.17 + uSeed * 17.31) * 43758.5453);
}

float heightField(vec2 p, float t) {
  float h = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float angle = 6.2831853 * hash11(fi + 3.0);
    vec2 direction = vec2(cos(angle), sin(angle));
    float frequency = 2.4 + fi * 1.45;
    h += sin(dot(p, direction) * frequency + t * (0.7 + fi * 0.13) + angle) / (1.0 + fi * 0.68);
  }
  return h * 0.24;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.56 + uSeed;
  vec2 p = uv * 1.65;
  float epsilon = 0.006;
  float left = heightField(p - vec2(epsilon, 0.0), t);
  float right = heightField(p + vec2(epsilon, 0.0), t);
  float down = heightField(p - vec2(0.0, epsilon), t);
  float up = heightField(p + vec2(0.0, epsilon), t);
  vec3 normal = normalize(vec3(left - right, down - up, epsilon * 2.7));
  vec3 viewDir = normalize(vec3(-uv * 0.28, 1.0));
  vec3 lightA = normalize(vec3(cos(t * 0.47), sin(t * 0.39), 0.72));
  vec3 lightB = normalize(vec3(-sin(t * 0.31), cos(t * 0.53), 0.48));
  float diffuse = 0.5 + 0.5 * dot(normal, lightA);
  float specA = pow(max(dot(reflect(-lightA, normal), viewDir), 0.0), 38.0);
  float specB = pow(max(dot(reflect(-lightB, normal), viewDir), 0.0), 64.0);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.4);

  vec3 col = mix(uColBg, uColSignal, 0.12 + diffuse * 0.42 + fresnel * 0.18);
  col = mix(col, uColPaper, specA * 0.86);
  col = mix(col, uColAccent, specB * 0.48 + fresnel * 0.10);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
