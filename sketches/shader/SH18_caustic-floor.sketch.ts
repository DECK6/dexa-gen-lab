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
  return fract(sin(p * 117.31 + uSeed * 9.73) * 43758.5453);
}

vec2 surfaceGradient(vec2 p, float t) {
  vec2 gradient = vec2(0.0);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float angle = 6.2831853 * hash11(fi + 1.0);
    vec2 direction = vec2(cos(angle), sin(angle));
    float frequency = 2.2 + fi * 0.83;
    float phase = dot(p, direction) * frequency + t * (0.65 + fi * 0.11) + angle;
    gradient += direction * cos(phase) * frequency / (2.2 + fi);
  }
  return gradient * 0.26;
}

vec2 floorProjection(vec2 p, float t) {
  return p + surfaceGradient(p, t) * 0.32;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.46 + uSeed;
  vec2 p = uv * 2.1;
  float epsilon = 0.012;
  vec2 dx = (floorProjection(p + vec2(epsilon, 0.0), t) -
    floorProjection(p - vec2(epsilon, 0.0), t)) / (2.0 * epsilon);
  vec2 dy = (floorProjection(p + vec2(0.0, epsilon), t) -
    floorProjection(p - vec2(0.0, epsilon), t)) / (2.0 * epsilon);
  float jacobian = abs(dx.x * dy.y - dx.y * dy.x);
  float focus = smoothstep(0.58, 0.04, jacobian);
  float filament = pow(focus, 2.2);
  float pool = 0.5 + 0.5 * sin(length(surfaceGradient(p, t)) * 8.0 - t);
  float vignette = smoothstep(1.55, 0.32, length(uv));

  vec3 col = mix(uColBg, uColSignal, (0.07 + focus * 0.78) * vignette);
  col = mix(col, uColPaper, filament * 0.42 * vignette);
  col = mix(col, uColAccent, filament * pool * 0.24 * vignette);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
