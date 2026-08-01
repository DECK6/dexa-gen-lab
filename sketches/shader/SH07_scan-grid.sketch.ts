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

// Line mask at every integer of g, thickness w in g units.
float lines(vec2 g, float w) {
  vec2 d = abs(fract(g - 0.5) - 0.5);
  return 1.0 - smoothstep(0.0, w, min(d.x, d.y));
}

float grain(vec2 c, float t) {
  vec2 q = floor(c * 0.5) + floor(t * 14.0);
  return fract(sin(dot(q, vec2(12.9898, 78.233)) + uSeed) * 43758.5453);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime + uSeed;

  float minor = lines(uv * 8.0, 0.045);
  float major = lines(uv * 2.0, 0.03);

  // Beam sweeps top to bottom, leaving a decaying trail behind it.
  float sweep = fract(t * 0.2);
  float sy = mix(1.25, -1.25, sweep);
  float beam = exp(-abs(uv.y - sy) * 30.0);
  float trail = exp(-clamp(uv.y - sy, 0.0, 3.0) * 3.4) * 0.32;

  float cross = max(
    1.0 - smoothstep(0.0, 0.005, abs(uv.x)),
    1.0 - smoothstep(0.0, 0.005, abs(uv.y)));
  float blink = 0.55 + 0.45 * sin(t * 2.2);

  vec3 col = mix(uColBg, uColSignal, minor * 0.14 + major * 0.40);
  col = mix(col, uColSignal, (beam * 0.95 + trail) * 0.8);
  col = mix(col, uColAccent, beam * major * 0.9 + beam * 0.22);
  col = mix(col, uColAccent, cross * blink * 0.3);
  col += (grain(gl_FragCoord.xy, t) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
