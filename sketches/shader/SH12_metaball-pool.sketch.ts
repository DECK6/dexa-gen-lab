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
  return fract(sin(p * 91.73 + uSeed * 13.17) * 43758.5453);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.52 + uSeed;
  float field = 0.0;
  float nearest = 4.0;

  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float phase = 6.2831853 * hash11(fi + 2.0);
    float speed = 0.34 + 0.18 * hash11(fi + 11.0);
    vec2 center = vec2(
      sin(t * speed + phase) * (0.48 + 0.25 * hash11(fi + 17.0)),
      cos(t * (speed * 0.83) + phase * 1.37) * (0.46 + 0.22 * hash11(fi + 23.0)));
    float radius = 0.14 + 0.055 * hash11(fi + 31.0);
    float d2 = dot(uv - center, uv - center);
    field += radius * radius / max(d2, 0.003);
    nearest = min(nearest, sqrt(d2));
  }

  float body = smoothstep(0.88, 1.08, field);
  float edge = 1.0 - smoothstep(0.02, 0.18, abs(field - 1.0));
  float inner = smoothstep(1.1, 3.6, field);
  float pulse = 0.5 + 0.5 * sin(field * 2.1 - t * 2.4);
  float core = smoothstep(0.13, 0.025, nearest);

  vec3 col = mix(uColBg, uColSignal, body * (0.24 + inner * 0.36));
  col = mix(col, uColSignal, edge * 0.94);
  col = mix(col, uColPaper, inner * pulse * 0.20);
  col = mix(col, uColAccent, core * 0.72 + edge * pulse * 0.12);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
