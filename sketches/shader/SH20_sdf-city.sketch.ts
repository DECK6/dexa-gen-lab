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
  return fract(sin(dot(p, vec2(127.31, 311.7)) + uSeed * 8.19) * 43758.5453);
}

float sdBox(vec3 p, vec3 bounds) {
  vec3 q = abs(p) - bounds;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float mapCity(vec3 p) {
  vec2 cell = floor((p.xz + 1.0) / 2.0);
  vec2 local = mod(p.xz + 1.0, 2.0) - 1.0;
  float height = 0.65 + hash21(cell) * 2.35;
  vec3 buildingPoint = vec3(local.x, p.y - height * 0.5, local.y);
  float building = sdBox(buildingPoint, vec3(0.56, height * 0.5, 0.56));
  return min(p.y, building);
}

vec3 cityNormal(vec3 p) {
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(
    mapCity(p + e.xyy) - mapCity(p - e.xyy),
    mapCity(p + e.yxy) - mapCity(p - e.yxy),
    mapCity(p + e.yyx) - mapCity(p - e.yyx)));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.34 + uSeed;
  vec3 rayOrigin = vec3(0.88, 1.65, t * 1.55 + 0.88);
  vec3 rayDirection = normalize(vec3(uv.x * 0.78, uv.y * 0.67 - 0.19, -1.42));
  float distanceTravelled = 0.0;
  float hit = 0.0;

  for (int i = 0; i < 56; i++) {
    float distanceToScene = mapCity(rayOrigin + rayDirection * distanceTravelled);
    if (distanceToScene < 0.002) { hit = 1.0; break; }
    distanceTravelled += distanceToScene * 0.82;
    if (distanceTravelled > 24.0) break;
  }

  float horizon = exp(-abs(uv.y + 0.18) * 9.0);
  vec3 col = mix(uColBg, uColSignal, horizon * 0.08);
  if (hit > 0.5) {
    vec3 position = rayOrigin + rayDirection * distanceTravelled;
    vec3 normal = cityNormal(position);
    vec3 light = normalize(vec3(0.48, 0.82, -0.34));
    float diffuse = 0.22 + 0.78 * max(dot(normal, light), 0.0);
    float sideCoordinate = abs(normal.x) > 0.5 ? position.z : position.x;
    float windowX = 1.0 - smoothstep(0.16, 0.23, abs(fract(sideCoordinate * 2.1) - 0.5));
    float windowY = 1.0 - smoothstep(0.13, 0.20, abs(fract(position.y * 2.35) - 0.5));
    vec2 cell = floor((position.xz + 1.0) / 2.0);
    float windows = windowX * windowY * step(0.36, hash21(cell + floor(position.y * 2.35)));
    windows *= step(0.08, position.y) * step(abs(normal.y), 0.5);
    float grid = step(abs(fract(position.x * 0.5) - 0.5), 0.018);
    grid = max(grid, step(abs(fract(position.z * 0.5) - 0.5), 0.018)) * step(position.y, 0.03);
    col = mix(uColBg, uColSignal, diffuse * 0.72);
    col = mix(col, uColPaper, windows * 0.28);
    col = mix(col, uColAccent, windows * 0.52 + grid * 0.18);
    col = mix(uColBg, col, exp(-distanceTravelled * 0.055));
  }
  gl_FragColor = vec4(col, 1.0);
}
`

export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)
}
