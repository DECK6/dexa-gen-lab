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
  return fract(sin(p * 137.17 + uSeed * 12.31) * 43758.5453);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.38 + uSeed;
  float veil = 0.0;
  float ridge = 0.0;

  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float phase = 6.2831853 * hash11(fi + 2.0);
    float base = mix(-0.82, 0.82, (fi + 0.5) / 6.0);
    float center = base + 0.15 * sin(uv.y * (2.2 + fi * 0.21) + t * (0.72 + fi * 0.06) + phase);
    center += 0.045 * sin(uv.y * 8.0 - t * 1.3 + phase * 1.7);
    float distanceToRibbon = abs(uv.x - center);
    float ribbon = exp(-distanceToRibbon * (24.0 + fi * 2.0));
    float striation = 0.58 + 0.42 * sin(uv.y * (8.0 + fi) - t * 1.7 + phase);
    veil += ribbon * striation;
    ridge = max(ridge, exp(-distanceToRibbon * 74.0) * striation);
  }

  float verticalFade = smoothstep(-1.22, -0.42, uv.y) * smoothstep(1.28, 0.68, uv.y);
  float shimmer = 0.76 + 0.24 * sin(uv.y * 18.0 + t * 2.2);
  veil = clamp(veil * verticalFade, 0.0, 1.0);
  ridge *= verticalFade * shimmer;

  vec3 col = mix(uColBg, uColSignal, veil * 0.82);
  col = mix(col, uColPaper, ridge * 0.22);
  col = mix(col, uColAccent, ridge * veil * 0.20);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
