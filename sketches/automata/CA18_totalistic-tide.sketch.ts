import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const W = 128
const H = 128
const SHADES = 24
const RULE = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  const rows = new Uint8Array(W * H)
  const lut = new Uint8Array(3 * SHADES * 3)
  let head = 0

  const seedRow = (base: number) => {
    for (let x = 0; x < W; x++) rows[base + x] = p.random(3) | 0
  }

  const advance = () => {
    const src = head * W
    head = (head + 1) % H
    const dst = head * W
    for (let x = 0; x < W; x++) {
      let sum = 0
      for (let d = -2; d <= 2; d++) sum += rows[src + (x + d + W) % W]
      rows[dst + x] = RULE[sum]
    }
    if (p.frameCount > 0 && p.frameCount % 96 === 0) seedRow(dst)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    buf = p.createGraphics(W, H)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels
    const bg = p.color(pal.bg)
    const bases = [p.color(pal.ink), p.color(pal.signal),
      p.lerpColor(p.color(pal.signal), p.color(pal.accent), 0.36)]
    for (let state = 0; state < 3; state++) for (let i = 0; i < SHADES; i++) {
      const c = p.lerpColor(bases[state], bg, (i / SHADES) * 0.76)
      const s = (state * SHADES + i) * 3
      lut[s] = p.red(c)
      lut[s + 1] = p.green(c)
      lut[s + 2] = p.blue(c)
    }
    seedRow(0)
    for (let y = 1; y < H; y++) advance()
  }

  p.draw = () => {
    advance()
    for (let y = 0; y < H; y++) {
      const src = ((head - y + H) % H) * W
      const shade = Math.min(SHADES - 1, (y * SHADES / H) | 0)
      for (let x = 0; x < W; x++) {
        const s = (rows[src + x] * SHADES + shade) * 3
        const o = (y * W + x) * 4
        px[o] = lut[s]
        px[o + 1] = lut[s + 1]
        px[o + 2] = lut[s + 2]
      }
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
