import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const W = 128
const H = 128
const RULES = [30, 90, 110]
const SPAN = 44
const SHADES = 24

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  const rows = new Uint8Array(W * H)
  const mark = new Uint8Array(H)
  const onLut = new Uint8Array(SHADES * 3)
  const offLut = new Uint8Array(SHADES * 3)
  const edge = new Uint8Array(3)
  const bar = new Uint8Array(3)
  let head = 0
  let ruleIdx = 0
  let rule = RULES[0]
  let emitted = 0

  const seedRow = (base: number) => {
    for (let x = 0; x < W; x++) rows[base + x] = 0
    rows[base + (W >> 1)] = 1
    for (let k = 0; k < 5; k++) rows[base + (p.random(W) | 0)] = 1
  }

  // one generation per call; the newest row is written at `head` so the field scrolls down
  const advance = () => {
    const src = head * W
    head = (head + 1) % H
    const dst = head * W
    emitted++
    if (emitted % SPAN === 0) {
      ruleIdx = (ruleIdx + 1) % RULES.length
      rule = RULES[ruleIdx]
      seedRow(dst)
      mark[head] = 1
      return
    }
    mark[head] = 0
    let live = 0
    for (let x = 0; x < W; x++) {
      const l = rows[src + (x === 0 ? W - 1 : x - 1)]
      const c = rows[src + x]
      const r = rows[src + (x === W - 1 ? 0 : x + 1)]
      const bit = (rule >> ((l << 2) | (c << 1) | r)) & 1
      rows[dst + x] = bit
      live += bit
    }
    if (live === 0 || live === W) seedRow(dst)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    p.background(pal.bg)
    buf = p.createGraphics(W, H)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels

    const sg = p.color(pal.signal)
    const dm = p.color(pal.dim)
    const bgc = p.color(pal.bg)
    const ink = p.color(pal.ink)
    const ac = p.color(pal.accent)
    for (let i = 0; i < SHADES; i++) {
      const t = i / (SHADES - 1)
      const on = p.lerpColor(sg, dm, t)
      const off = p.lerpColor(ink, bgc, t)
      onLut[i * 3] = p.red(on)
      onLut[i * 3 + 1] = p.green(on)
      onLut[i * 3 + 2] = p.blue(on)
      offLut[i * 3] = p.red(off)
      offLut[i * 3 + 1] = p.green(off)
      offLut[i * 3 + 2] = p.blue(off)
    }
    edge[0] = p.red(ac)
    edge[1] = p.green(ac)
    edge[2] = p.blue(ac)
    const bc = p.lerpColor(bgc, ac, 0.3)
    bar[0] = p.red(bc)
    bar[1] = p.green(bc)
    bar[2] = p.blue(bc)

    seedRow(0)
    for (let i = 1; i < H; i++) advance()
  }

  const paint = () => {
    for (let y = 0; y < H; y++) {
      const src = (((head - y) % H) + H) % H
      const base = src * W
      const s = Math.min(SHADES - 1, ((y / H) * SHADES) | 0) * 3
      const hot = y === 0
      const ruled = mark[src] === 1
      for (let x = 0; x < W; x++) {
        const on = rows[base + x] === 1
        const o = (y * W + x) * 4
        if (hot && on) {
          px[o] = edge[0]
          px[o + 1] = edge[1]
          px[o + 2] = edge[2]
        } else if (ruled && !on) {
          px[o] = bar[0]
          px[o + 1] = bar[1]
          px[o + 2] = bar[2]
        } else {
          const lut = on ? onLut : offLut
          px[o] = lut[s]
          px[o + 1] = lut[s + 1]
          px[o + 2] = lut[s + 2]
        }
      }
    }
  }

  p.draw = () => {
    if (p.frameCount % 2 === 1) advance()
    paint()
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
