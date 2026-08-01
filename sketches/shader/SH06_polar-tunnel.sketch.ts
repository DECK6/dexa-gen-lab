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
  float t = uTime * 0.4 + uSeed;

  // Off-axis wobble so the vanishing point drifts.
  uv += 0.12 * vec2(sin(t * 0.37), cos(t * 0.29));

  float r = max(length(uv), 0.015);
  float a = atan(uv.y, uv.x) + 0.35 * sin(t * 0.6 + r * 2.2);

  // Tunnel wall coordinates: angle around, inverse radius along depth.
  vec2 tc = vec2(a / 3.14159265 + t * 0.12, 1.0 / r + t * 1.15);
  vec2 gv = abs(fract(tc * vec2(7.0, 1.0)) - 0.5);
  float spokes = smoothstep(0.42, 0.5, gv.x);
  float rings = smoothstep(0.40, 0.5, gv.y);
  float grid = max(spokes, rings);

  float pulse = 0.5 + 0.5 * sin(tc.y * 2.6 - t * 4.0);
  float depth = smoothstep(0.0, 0.7, r);

  vec3 col = mix(uColBg, uColSignal, (grid * 0.7 + pulse * 0.2) * depth);
  col = mix(col, uColAccent, rings * pulse * depth * 0.55);
  col = mix(uColBg, col, depth);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
