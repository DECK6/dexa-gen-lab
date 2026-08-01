import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const BUF = 150 // low-res offscreen buffer, upscaled to the canvas
const SLICE = 30 // rows per frame — one full pass every 5 frames
const LUT_N = 256
const ZOOM_STEP = 0.02
const ZOOM_MAX = 14 // exp(-14) ~ 8e-7, well inside double precision

// Boundary points worth drifting into.
const TARGETS: number[][] = [
  [-0.743643887037151, 0.13182590420533],
  [-0.16070135, 1.0375665],
  [0.001643721971153, -0.822467633298876],
  [-1.749204633459011, 0.000028275361],
  [-0.10109636384562, 0.95628651080914],
]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const lr = new Uint8Array(LUT_N)
  const lg = new Uint8Array(LUT_N)
  const lb = new Uint8Array(LUT_N)
  const solid = [0, 0, 0]
  let buf!: P5.Graphics
  let row = 0
  let zt = 0
  let ti = 0
  let scale = 3
  let cx = 0
  let cy = 0
  let maxIter = 90
  let band = 0

  const ramp = (tokens: string[]) => {
    const stops = tokens.map((t) => p.color(t))
    for (let i = 0; i < LUT_N; i++) {
      const u = (i / (LUT_N - 1)) * (stops.length - 1)
      const k = Math.min(stops.length - 2, Math.floor(u))
      const c = p.lerpColor(stops[k]!, stops[k + 1]!, u - k)
      lr[i] = p.red(c)
      lg[i] = p.green(c)
      lb[i] = p.blue(c)
    }
  }

  const nextPass = () => {
    zt += ZOOM_STEP
    if (zt > ZOOM_MAX) {
      zt = 0
      ti = (ti + 1) % TARGETS.length
    }
    scale = 3 * Math.exp(-zt)
    const t = TARGETS[ti]!
    const nz = zt * 0.32
    cx = t[0]! + (p.noise(11.3, nz) - 0.5) * scale * 0.55
    cy = t[1]! + (p.noise(47.9, nz) - 0.5) * scale * 0.55
    maxIter = Math.min(260, 90 + Math.floor(zt * 14))
    band = p.frameCount * 0.0022
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    buf = p.createGraphics(BUF, BUF)
    buf.pixelDensity(1)
    // Cyclic ramp so the drifting bands wrap without a seam.
    ramp([pal.bg, pal.dim, pal.signal, pal.paper, pal.accent, pal.ink, pal.bg])
    const body = p.color(pal.ink)
    solid[0] = p.red(body)
    solid[1] = p.green(body)
    solid[2] = p.blue(body)
    ti = Math.floor(p.random(TARGETS.length))
    zt = p.random(0.4)
    nextPass()
  }

  p.draw = () => {
    buf.loadPixels()
    const px = buf.pixels
    const last = Math.min(BUF, row + SLICE)
    for (let y = row; y < last; y++) {
      const ci = cy + (y / BUF - 0.5) * scale
      for (let x = 0; x < BUF; x++) {
        const cr = cx + (x / BUF - 0.5) * scale
        let zr = 0
        let zi = 0
        let n = 0
        while (n < maxIter && zr * zr + zi * zi <= 64) {
          const t = zr * zr - zi * zi + cr
          zi = 2 * zr * zi + ci
          zr = t
          n++
        }
        const idx = 4 * (y * BUF + x)
        if (n >= maxIter) {
          px[idx] = solid[0]!
          px[idx + 1] = solid[1]!
          px[idx + 2] = solid[2]!
        } else {
          const sm = n + 1 - Math.log(Math.log(Math.sqrt(zr * zr + zi * zi))) / Math.LN2
          const u = (Math.sqrt(Math.max(sm, 0)) * 0.15 + band) % 1
          const k = Math.floor(u * (LUT_N - 1))
          px[idx] = lr[k]!
          px[idx + 1] = lg[k]!
          px[idx + 2] = lb[k]!
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
