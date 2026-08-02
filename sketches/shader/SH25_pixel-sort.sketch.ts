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

float hash41(vec4 p) {
  return fract(sin(dot(p, vec4(127.31, 311.7, 74.73, 19.19)) + uSeed * 12.47) * 43758.5453);
}

float sourceBrightness(float row, float segment, float index, float epoch) {
  float base = hash41(vec4(row, segment, index, epoch));
  float drift = 0.18 * sin(index * 1.7 + row * 0.13 + epoch + uSeed);
  return clamp(base + drift, 0.0, 1.0);
}

float sortedBrightness(float row, float segment, float targetRank, float epoch) {
  float result = 0.0;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float candidate = sourceBrightness(row, segment, fi, epoch);
    float rank = 0.0;
    for (int j = 0; j < 8; j++) {
      float fj = float(j);
      float other = sourceBrightness(row, segment, fj, epoch);
      rank += step(other + fj * 0.0001, candidate + fi * 0.0001);
    }
    result = mix(result, candidate, 1.0 - step(0.25, abs(rank - targetRank)));
  }
  return result;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.62 + uSeed;
  float rowCoordinate = (uv.y + 1.2) * 22.0 + t * 2.4;
  float row = floor(rowCoordinate);
  float rowLocal = fract(rowCoordinate);
  float horizontal = (uv.x + 1.2) * 1.45;
  float segment = floor(horizontal);
  float slotCoordinate = fract(horizontal) * 8.0;
  float targetRank = floor(slotCoordinate) + 1.0;
  float epoch = floor(t * 0.82);
  float brightness = sortedBrightness(row, segment, targetRank, epoch);
  float slotEdge = max(abs(fract(slotCoordinate) - 0.5), abs(rowLocal - 0.5));
  float cellBorder = smoothstep(0.43, 0.49, slotEdge);
  float streak = smoothstep(0.18, 0.92, brightness);
  float brightTail = smoothstep(0.72, 0.96, brightness) * smoothstep(5.0, 8.0, targetRank);
  float scan = exp(-abs(rowLocal - fract(t * 1.7)) * 15.0);
  float aperture = step(abs(uv.x), 1.08) * step(abs(uv.y), 1.08);

  vec3 col = mix(uColBg, uColSignal, (0.08 + streak * 0.74) * aperture);
  col = mix(col, uColBg, cellBorder * 0.16);
  col = mix(col, uColPaper, brightTail * 0.22 * aperture);
  col = mix(col, uColAccent, brightTail * scan * 0.50 * aperture);
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
