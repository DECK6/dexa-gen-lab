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

mat2 rotate2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.24 + uSeed;
  vec2 p = uv * 1.45;
  vec2 constant = vec2(
    0.78 + 0.09 * sin(t * 0.83 + uSeed),
    0.43 + 0.08 * cos(t * 0.67 + uSeed * 1.3));
  float orbitTrap = 8.0;
  float energy = 0.0;

  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    p = abs(p) / max(dot(p, p), 0.065) - constant;
    p = rotate2d(0.08 * sin(t + fi * 0.7)) * p;
    float radius = length(p);
    orbitTrap = min(orbitTrap, abs(radius - 0.74));
    energy += exp(-abs(radius - 1.0) * 7.0) / (1.0 + fi * 0.38);
  }

  float filaments = exp(-orbitTrap * 34.0);
  float bands = 0.5 + 0.5 * cos(log(orbitTrap + 0.018) * 8.0 - t * 2.1);
  float core = clamp(energy * 0.19, 0.0, 1.0);
  float vignette = smoothstep(1.5, 0.18, length(uv));

  vec3 col = mix(uColBg, uColSignal, (filaments * 0.74 + core * 0.26) * vignette);
  col = mix(col, uColPaper, filaments * bands * 0.20 * vignette);
  col = mix(col, uColAccent, filaments * (1.0 - bands) * 0.28 * vignette);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
