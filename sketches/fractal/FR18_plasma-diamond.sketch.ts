import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 129
const CELLS = N * N
const CYCLE = 600

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: P5.Graphics
  let fieldA = new Float32Array(CELLS)
  let fieldB = new Float32Array(CELLS)
  const rgb: number[][] = []

  const makeField = (): Float32Array<ArrayBuffer> => {
    const h = new Float32Array(CELLS)
    h[0] = p.random(-1, 1)
    h[N - 1] = p.random(-1, 1)
    h[(N - 1) * N] = p.random(-1, 1)
    h[CELLS - 1] = p.random(-1, 1)
    let step = N - 1
    let amp = 1
    while (step > 1) {
      const half = step / 2
      for (let y = half; y < N - 1; y += step) {
        for (let x = half; x < N - 1; x += step) {
          h[y * N + x] = (h[(y - half) * N + x - half]! + h[(y - half) * N + x + half]! +
            h[(y + half) * N + x - half]! + h[(y + half) * N + x + half]!) / 4 + p.random(-amp, amp)
        }
      }
      for (let y = 0; y < N; y += half) {
        for (let x = (y / half) % 2 === 0 ? half : 0; x < N; x += step) {
          let sum = 0
          let count = 0
          if (x >= half) { sum += h[y * N + x - half]!; count++ }
          if (x + half < N) { sum += h[y * N + x + half]!; count++ }
          if (y >= half) { sum += h[(y - half) * N + x]!; count++ }
          if (y + half < N) { sum += h[(y + half) * N + x]!; count++ }
          h[y * N + x] = sum / count + p.random(-amp, amp)
        }
      }
      step = half
      amp *= 0.53
    }
    let lo = Infinity
    let hi = -Infinity
    for (const v of h) { lo = Math.min(lo, v); hi = Math.max(hi, v) }
    for (let i = 0; i < CELLS; i++) h[i] = (h[i]! - lo) / Math.max(hi - lo, 0.0001)
    return h
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    p.background(pal.bg)
    buf = p.createGraphics(N, N)
    buf.pixelDensity(1)
    for (const token of [pal.bg, pal.dim, pal.signal, pal.accent]) {
      const c = p.color(token)
      rgb.push([p.red(c), p.green(c), p.blue(c)])
    }
    fieldA = makeField()
    fieldB = makeField()
  }

  p.draw = () => {
    if (p.frameCount % CYCLE === 0) {
      fieldA = fieldB
      fieldB = makeField()
    }
    const u = (p.frameCount % CYCLE) / CYCLE
    const blend = u * u * (3 - 2 * u)
    const flow = p.frameCount * 0.006
    buf.loadPixels()
    for (let i = 0; i < CELLS; i++) {
      const v = p.lerp(fieldA[i]!, fieldB[i]!, blend)
      const wave = ((v * 9 + flow) % 1 + 1) % 1
      const line = Math.max(0, 1 - Math.abs(wave - 0.5) * 13)
      const base = 0.12 + v * 0.2
      const accent = v > 0.83 ? line * (v - 0.83) * 4.8 : 0
      const o = i * 4
      for (let c = 0; c < 3; c++) {
        const ground = rgb[0]![c]! * (1 - base) + rgb[1]![c]! * base
        const traced = ground * (1 - line) + rgb[2]![c]! * line
        buf.pixels[o + c] = traced * (1 - accent) + rgb[3]![c]! * accent
      }
      buf.pixels[o + 3] = 255
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
