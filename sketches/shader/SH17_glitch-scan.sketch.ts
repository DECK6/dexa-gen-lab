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
  return fract(sin(dot(p, vec2(127.31, 311.7)) + uSeed * 15.13) * 43758.5453);
}

float diagnostic(vec2 p) {
  float ring = 1.0 - smoothstep(0.018, 0.042, abs(length(p) - 0.58));
  float crossX = 1.0 - smoothstep(0.008, 0.018, abs(p.x));
  float crossY = 1.0 - smoothstep(0.008, 0.018, abs(p.y));
  float bars = step(0.72, hash21(vec2(floor((p.x + 1.2) * 14.0), 3.0)));
  bars *= step(0.76, abs(p.y)) * step(abs(p.x), 1.05);
  return max(ring, max(crossX, crossY) * 0.62) + bars * 0.72;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime + uSeed;
  float slice = floor((uv.y + 1.2) * 20.0);
  float epoch = floor(t * 3.2);
  float randomOffset = hash21(vec2(slice, epoch));
  float envelope = sin(fract(t * 3.2) * 3.1415927);
  float rupture = step(0.63, randomOffset) * envelope;
  vec2 displaced = uv;
  displaced.x += (randomOffset - 0.5) * 0.72 * rupture;

  float source = diagnostic(displaced);
  float echo = diagnostic(displaced + vec2(0.035 * rupture, 0.0));
  float scanlines = 0.16 * (0.5 + 0.5 * sin((uv.y * uRes.y - t * 180.0) * 0.42));
  float beamY = mix(1.15, -1.15, fract(t * 0.23));
  float beam = exp(-abs(uv.y - beamY) * 38.0);
  float sliceEdge = 1.0 - smoothstep(0.0, 0.025, abs(fract((uv.y + 1.2) * 20.0) - 0.5));
  float tear = rupture * sliceEdge;

  vec3 col = mix(uColBg, uColSignal, source * 0.70 + scanlines * 0.22 + beam * 0.52);
  col = mix(col, uColPaper, echo * rupture * 0.18);
  col = mix(col, uColAccent, tear * 0.70 + abs(source - echo) * rupture * 0.46);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
