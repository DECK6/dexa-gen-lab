import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const BUF = 144 // low-res offscreen buffer, upscaled to the canvas
const SLICE = 36 // rows per frame — one full pass every 4 frames
const LUT_N = 256
const MAX_ITER = 150
const MU_R = 0.985 // mu orbits this circle; c = mu/2 - mu^2/4 stays inside the main
// cardioid, so every frame is a connected Julia set with a solid interior.

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const out = { r: new Uint8Array(LUT_N), g: new Uint8Array(LUT_N), b: new Uint8Array(LUT_N) }
  const core = { r: new Uint8Array(LUT_N), g: new Uint8Array(LUT_N), b: new Uint8Array(LUT_N) }
  let buf!: P5.Graphics
  let row = 0
  let phi = 0
  let pass = 0
  let half = 1.55
  let cr = 0
  let ci = 0

  const ramp = (dst: typeof out, tokens: string[]) => {
    const stops = tokens.map((t) => p.color(t))
    for (let i = 0; i < LUT_N; i++) {
      const u = (i / (LUT_N - 1)) * (stops.length - 1)
      const k = Math.min(stops.length - 2, Math.floor(u))
      const c = p.lerpColor(stops[k]!, stops[k + 1]!, u - k)
      dst.r[i] = p.red(c)
      dst.g[i] = p.green(c)
      dst.b[i] = p.blue(c)
    }
  }

  const nextPass = () => {
    phi += 0.012
    pass++
    half = 1.3 + 0.14 * Math.sin(pass * 0.017)
    const mr = MU_R * Math.cos(phi)
    const mi = MU_R * Math.sin(phi)
    cr = mr / 2 - (mr * mr - mi * mi) / 4
    ci = mi / 2 - (mr * mi) / 2
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    buf = p.createGraphics(BUF, BUF)
    buf.pixelDensity(1)
    ramp(out, [pal.bg, pal.ink, pal.dim, pal.signal, pal.paper])
    ramp(core, [pal.bg, pal.ink, pal.signal, pal.accent])
    phi = p.random(p.TWO_PI)
    nextPass()
  }

  p.draw = () => {
    buf.loadPixels()
    const px = buf.pixels
    const last = Math.min(BUF, row + SLICE)
    for (let y = row; y < last; y++) {
      const y0 = (y / BUF - 0.5) * 2 * half
      for (let x = 0; x < BUF; x++) {
        let zr = (x / BUF - 0.5) * 2 * half
        let zi = y0
        let n = 0
        let trap = 9
        while (n < MAX_ITER && zr * zr + zi * zi <= 36) {
          const t = zr * zr - zi * zi + cr
          zi = 2 * zr * zi + ci
          zr = t
          const d = zr * zr + zi * zi
          if (d < trap) trap = d
          n++
        }
        const idx = 4 * (y * BUF + x)
        if (n >= MAX_ITER) {
          // Interior: orbit trap distance to the origin lights the core.
          const u = Math.pow(Math.exp(-Math.sqrt(trap) * 2.2), 1.6)
          const k = Math.floor(u * (LUT_N - 1))
          px[idx] = core.r[k]!
          px[idx + 1] = core.g[k]!
          px[idx + 2] = core.b[k]!
        } else {
          const sm = n + 1 - Math.log(Math.log(Math.sqrt(zr * zr + zi * zi))) / Math.LN2
          const k = Math.floor(Math.min(1, Math.sqrt(Math.max(sm, 0) / MAX_ITER) * 1.9) * (LUT_N - 1))
          px[idx] = out.r[k]!
          px[idx + 1] = out.g[k]!
          px[idx + 2] = out.b[k]!
        }
        px[idx + 3] = 255
      }
    }
    buf.updatePixels()
    row = last >= BUF ? 0 : last
    if (row === 0) nextPass()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
