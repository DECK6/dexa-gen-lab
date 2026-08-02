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
  return fract(sin(p * 127.31 + uSeed * 19.7) * 43758.5453);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.48 + uSeed;
  float radius = length(uv);
  float angle = atan(uv.y, uv.x) - t * 0.42 + sin(radius * 3.0 - t) * 0.11;
  float sector = floor((angle + 3.1415927) * 4.45634);
  float rayPhase = abs(fract(angle * 4.45634) - 0.5);
  float width = 0.035 + 0.055 * hash11(sector);
  float ray = 1.0 - smoothstep(width, width + 0.075, rayPhase);
  float radialBeat = 0.58 + 0.42 * sin(radius * 19.0 - t * 3.2 + sector);
  float falloff = exp(-radius * (0.72 + hash11(sector + 17.0) * 1.15));
  float burst = ray * falloff * radialBeat;
  float core = exp(-radius * 9.0);
  float halo = exp(-abs(radius - 0.28 - 0.04 * sin(t * 1.6)) * 22.0);

  vec3 col = mix(uColBg, uColSignal, burst * 0.92 + halo * 0.20);
  col = mix(col, uColPaper, core * 0.58 + burst * core * 0.24);
  col = mix(col, uColAccent, halo * ray * 0.42 + core * 0.26);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
