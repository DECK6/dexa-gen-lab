import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const BUF = 150
const SLICE = 50
const MAX_ITER = 28
const LUT_N = 96
const ROOTS: [number, number][] = [[1, 0], [-0.5, 0.8660254], [-0.5, -0.8660254]]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const lut = new Uint8Array(3 * LUT_N * 3)
  let buf!: P5.Graphics
  let row = 0
  let turn = 0
  let phase = 0

  const nextPass = () => {
    turn = phase + p.frameCount * 0.0022
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    buf = p.createGraphics(BUF, BUF)
    buf.pixelDensity(1)
    phase = p.random(p.TWO_PI)
    const roots = [pal.signal, pal.dim, pal.paper]
    for (let root = 0; root < 3; root++) {
      for (let i = 0; i < LUT_N; i++) {
        const u = i / (LUT_N - 1)
        const base = p.lerpColor(p.color(pal.bg), p.color(roots[root]!), 0.22 + u * 0.78)
        const c = u > 0.82 ? p.lerpColor(base, p.color(pal.accent), (u - 0.82) / 0.18) : base
        const k = (root * LUT_N + i) * 3
        lut[k] = p.red(c)
        lut[k + 1] = p.green(c)
        lut[k + 2] = p.blue(c)
      }
    }
    nextPass()
  }

  p.draw = () => {
    buf.loadPixels()
    const last = Math.min(BUF, row + SLICE)
    const co = Math.cos(turn)
    const si = Math.sin(turn)
    for (let y = row; y < last; y++) {
      for (let x = 0; x < BUF; x++) {
        const px = (x / (BUF - 1) - 0.5) * 3.4
        const py = (y / (BUF - 1) - 0.5) * 3.4
        let zr = px * co - py * si
        let zi = px * si + py * co
        let n = 0
        for (; n < MAX_ITER; n++) {
          const z2r = zr * zr - zi * zi
          const z2i = 2 * zr * zi
          const fr = z2r * zr - z2i * zi - 1
          const fi = z2r * zi + z2i * zr
          if (fr * fr + fi * fi < 0.00000001) break
          const gr = 3 * z2r
          const gi = 3 * z2i
          const den = Math.max(gr * gr + gi * gi, 0.0000000001)
          zr -= (fr * gr + fi * gi) / den
          zi -= (fi * gr - fr * gi) / den
        }
        let root = 0
        let nearest = Infinity
        for (let k = 0; k < ROOTS.length; k++) {
          const dx = zr - ROOTS[k]![0]
          const dy = zi - ROOTS[k]![1]
          if (dx * dx + dy * dy < nearest) {
            nearest = dx * dx + dy * dy
            root = k
          }
        }
        const shade = Math.min(LUT_N - 1, Math.floor((0.18 + (n / MAX_ITER) * 0.82) * (LUT_N - 1)))
        const k = (root * LUT_N + shade) * 3
        const o = (y * BUF + x) * 4
        buf.pixels[o] = lut[k]!
        buf.pixels[o + 1] = lut[k + 1]!
        buf.pixels[o + 2] = lut[k + 2]!
        buf.pixels[o + 3] = 255
      }
    }
    buf.updatePixels()
    row = last === BUF ? 0 : last
    if (row === 0) nextPass()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
