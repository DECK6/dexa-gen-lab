import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const BUF = 144
const SLICE = 48
const LUT_N = 192
const MAX_ITER = 96

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const lut = new Uint8Array(LUT_N * 3)
  const solid = new Uint8Array(3)
  let buf!: P5.Graphics
  let row = 0
  let cx = -0.52
  let cy = -0.55
  let turn = 0
  let drift = 0

  const nextPass = () => {
    const t = p.frameCount * 0.004
    cx = -0.52 + (p.noise(drift, t) - 0.5) * 0.18
    cy = -0.55 + (p.noise(drift + 21, t) - 0.5) * 0.16
    turn = Math.sin(t * 0.7 + drift) * 0.055
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    buf = p.createGraphics(BUF, BUF)
    buf.pixelDensity(1)
    drift = p.random(100)
    const stops = [pal.bg, pal.ink, pal.dim, pal.signal, pal.paper, pal.accent]
    for (let i = 0; i < LUT_N; i++) {
      const u = (i / (LUT_N - 1)) * (stops.length - 1)
      const k = Math.min(stops.length - 2, Math.floor(u))
      const c = p.lerpColor(p.color(stops[k]!), p.color(stops[k + 1]!), u - k)
      lut[i * 3] = p.red(c)
      lut[i * 3 + 1] = p.green(c)
      lut[i * 3 + 2] = p.blue(c)
    }
    const core = p.color(pal.ink)
    solid[0] = p.red(core)
    solid[1] = p.green(core)
    solid[2] = p.blue(core)
    nextPass()
  }

  p.draw = () => {
    buf.loadPixels()
    const last = Math.min(BUF, row + SLICE)
    const co = Math.cos(turn)
    const si = Math.sin(turn)
    for (let y = row; y < last; y++) {
      for (let x = 0; x < BUF; x++) {
        const dx = (x / (BUF - 1) - 0.5) * 3.05
        const dy = (y / (BUF - 1) - 0.5) * 3.05
        const cr = cx + dx * co - dy * si
        const ci = cy + dx * si + dy * co
        let zr = 0
        let zi = 0
        let n = 0
        while (n < MAX_ITER && zr * zr + zi * zi < 64) {
          const ar = Math.abs(zr)
          const ai = Math.abs(zi)
          zr = ar * ar - ai * ai + cr
          zi = 2 * ar * ai + ci
          n++
        }
        const o = (y * BUF + x) * 4
        const k = n >= MAX_ITER ? -1 : Math.min(LUT_N - 1, Math.floor(Math.sqrt(n / MAX_ITER) * LUT_N * 1.6))
        buf.pixels[o] = k < 0 ? solid[0]! : lut[k * 3]!
        buf.pixels[o + 1] = k < 0 ? solid[1]! : lut[k * 3 + 1]!
        buf.pixels[o + 2] = k < 0 ? solid[2]! : lut[k * 3 + 2]!
        buf.pixels[o + 3] = 255
      }
    }
    buf.updatePixels()
    row = last === BUF ? 0 : last
    if (row === 0) nextPass()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
