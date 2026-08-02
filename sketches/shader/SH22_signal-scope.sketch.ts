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

float waveform(float x, float t) {
  float phase = uSeed * 1.73;
  float carrier = sin(x * 7.8 + t * 2.7 + phase) * 0.25;
  float harmonic = sin(x * 16.4 - t * 1.9 + phase * 0.7) * 0.10;
  float modulation = 0.72 + 0.28 * sin(x * 2.1 + t * 0.43);
  return (carrier + harmonic) * modulation + 0.06 * sin(t * 1.4 + phase);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime + uSeed;
  vec2 gridCell = abs(fract((uv + 1.0) * 5.0) - 0.5);
  float minorGrid = 1.0 - smoothstep(0.015, 0.035, min(gridCell.x, gridCell.y));
  float axis = max(
    1.0 - smoothstep(0.004, 0.010, abs(uv.x)),
    1.0 - smoothstep(0.004, 0.010, abs(uv.y)));
  float persistence = 0.0;

  for (int i = 0; i < 12; i++) {
    float age = float(i) * 0.035;
    float distanceToTrace = abs(uv.y - waveform(uv.x, t - age));
    persistence += exp(-distanceToTrace * (48.0 + float(i) * 2.5)) * exp(-float(i) * 0.24);
  }

  float currentDistance = abs(uv.y - waveform(uv.x, t));
  float currentTrace = exp(-currentDistance * 105.0);
  float markerX = sin(t * 0.61) * 0.82;
  vec2 markerPosition = vec2(markerX, waveform(markerX, t));
  float marker = 1.0 - smoothstep(0.025, 0.055, length(uv - markerPosition));
  float aperture = step(abs(uv.x), 1.0) * step(abs(uv.y), 1.0);

  vec3 col = mix(uColBg, uColSignal, (minorGrid * 0.11 + axis * 0.26) * aperture);
  col = mix(col, uColSignal, clamp(persistence * 0.22, 0.0, 0.82) * aperture);
  col = mix(col, uColPaper, currentTrace * 0.25 * aperture);
  col = mix(col, uColAccent, marker * 0.72 + currentTrace * marker * 0.18);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
