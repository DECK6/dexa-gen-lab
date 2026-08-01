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

vec2 hash22(vec2 p) {
  vec3 a = fract(p.xyx * vec3(0.1031, 0.1030, 0.0973) + uSeed * 0.017);
  a += dot(a, a.yzx + 33.33);
  return fract((a.xx + a.yz) * a.zy);
}

// Drifting site position for the cell at lattice coordinate g + o.
vec2 site(vec2 g, vec2 o, float t) {
  vec2 h = hash22(g + o);
  return o + 0.5 + 0.42 * sin(t * (0.6 + h.y * 0.9) + 6.2831853 * h);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.4 + uSeed;
  vec2 p = uv * 3.1 + vec2(sin(t * 0.13), cos(t * 0.11)) * 0.7;
  vec2 g = floor(p);
  vec2 f = fract(p);

  vec2 mr = vec2(0.0);
  vec2 mo = vec2(0.0);
  float md = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 r = site(g, o, t) - f;
      float d = dot(r, r);
      if (d < md) { md = d; mr = r; mo = o; }
    }
  }

  float edge = 8.0;
  for (int j = -2; j <= 2; j++) {
    for (int i = -2; i <= 2; i++) {
      vec2 o = mo + vec2(float(i), float(j));
      vec2 r = site(g, o, t) - f;
      vec2 diff = r - mr;
      if (dot(diff, diff) > 0.0001) {
        edge = min(edge, dot(0.5 * (mr + r), normalize(diff)));
      }
    }
  }

  float tone = hash22(g + mo + 7.0).x;
  float pulse = 0.5 + 0.5 * sin(t * 1.4 + tone * 14.0);
  float fill = clamp(0.12 + tone * 0.46 + pulse * 0.16, 0.0, 1.0);
  float border = 1.0 - smoothstep(0.0, 0.055, edge);
  float core = smoothstep(0.34, 0.02, sqrt(md));

  vec3 col = mix(uColBg, uColSignal, fill * 0.5);
  col = mix(col, uColSignal, border * 0.9);
  col = mix(col, uColAccent, core * step(0.84, tone) * pulse * 0.85);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
