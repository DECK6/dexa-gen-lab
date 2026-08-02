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

float ringLine(float radius, float frequency) {
  float band = abs(fract(radius * frequency) - 0.5);
  return 1.0 - smoothstep(0.035, 0.095, band);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.28 + uSeed;
  vec2 axis = vec2(cos(t), sin(t * 0.83));
  vec2 centerA = axis * (0.16 + 0.04 * sin(t * 1.7));
  vec2 centerB = -axis.yx * (0.18 + 0.05 * cos(t * 1.3));
  float radiusA = length(uv - centerA);
  float radiusB = length(uv - centerB);
  float gridA = ringLine(radiusA, 12.5);
  float gridB = ringLine(radiusB, 12.5);
  float crossing = gridA * gridB;
  float beat = pow(0.5 + 0.5 * cos((radiusA - radiusB) * 78.54), 5.0);
  float aperture = smoothstep(1.42, 0.18, length(uv));

  vec3 col = mix(uColBg, uColSignal, max(gridA, gridB) * 0.62 * aperture);
  col = mix(col, uColSignal, beat * 0.22 * aperture);
  col = mix(col, uColAccent, crossing * 0.78 * aperture);
  col = mix(col, uColPaper, crossing * beat * 0.18);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
