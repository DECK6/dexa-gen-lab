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

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.5 + uSeed;

  float sum = 0.0;
  float nearest = 8.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float ph = uSeed * 1.7 + fi * 2.399;
    vec2 src = 0.82 * vec2(
      cos(t * (0.28 + fi * 0.07) + ph),
      sin(t * (0.24 + fi * 0.10) + ph * 1.3));
    float d = length(uv - src);
    nearest = min(nearest, d);
    sum += sin(d * 21.0 - t * 3.4 + ph) / (1.0 + d * 2.4);
  }

  float w = sum * 0.55;
  float crest = smoothstep(-0.2, 0.85, w);
  float nodal = 1.0 - smoothstep(0.0, 0.05, abs(w));
  float src = smoothstep(0.085, 0.0, nearest);

  vec3 col = mix(uColBg, uColSignal, crest * 0.88);
  col = mix(col, uColAccent, nodal * 0.32);
  col = mix(col, uColAccent, src * 0.95);
  col *= 0.9 + 0.2 * crest;
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
