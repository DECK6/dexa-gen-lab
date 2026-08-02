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
  return fract(sin(dot(p, vec2(127.31, 311.7)) + uSeed * 11.9) * 43758.5453);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.72 + uSeed;
  vec2 p = uv * 6.0;
  vec2 cell = floor(p);
  vec2 local = fract(p) - 0.5;
  float rowSeed = hash21(vec2(0.0, cell.y));
  float lane = (floor(rowSeed * 3.0) - 1.0) * 0.22;
  float branchSeed = hash21(cell + 9.0);
  float branchX = hash21(cell + 21.0) * 0.62 - 0.31;
  float branch = step(0.70, branchSeed);
  float horizontalDistance = abs(local.y - lane);
  float verticalDistance = abs(local.x - branchX);
  float traceDistance = min(horizontalDistance, mix(2.0, verticalDistance, branch));
  float trace = 1.0 - smoothstep(0.022, 0.058, traceDistance);
  float padDistance = length(local - vec2(branchX, lane));
  float pad = branch * (1.0 - smoothstep(0.07, 0.12, padDistance));
  float hole = branch * (1.0 - smoothstep(0.018, 0.04, padDistance));

  float horizontalPhase = fract(p.x * 0.12 + cell.y * 0.173 - t * 0.46);
  float verticalPhase = fract(p.y * 0.12 + cell.x * 0.127 - t * 0.46);
  float pulseH = exp(-abs(horizontalPhase - 0.5) * 17.0);
  float pulseV = exp(-abs(verticalPhase - 0.5) * 17.0) * branch;
  float pulse = max(pulseH, pulseV);
  float substrate = 0.04 * (0.5 + 0.5 * sin((p.x + p.y) * 3.1415927));

  vec3 col = mix(uColBg, uColSignal, substrate + trace * 0.42 + pad * 0.30);
  col = mix(col, uColSignal, trace * pulse * 0.92);
  col = mix(col, uColAccent, pad * pulse * 0.76 + hole * 0.34);
  col = mix(col, uColPaper, hole * pulse * 0.22);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
