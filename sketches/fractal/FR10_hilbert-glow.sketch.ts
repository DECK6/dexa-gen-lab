import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const ORDERS = [4, 5, 6]
const TRAIL = 170
const LAP_FRAMES = 620 // head speed adapts so every order takes about the same time

// Hilbert d2xy — iterative, order is bounded by ORDERS.
function d2xy(n: number, d: number, out: number[]): void {
  let t = d
  let x = 0
  let y = 0
  for (let s = 1; s < n; s *= 2) {
    const rx = 1 & (t >> 1)
    const ry = 1 & (t ^ rx)
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x
        y = s - 1 - y
      }
      const tmp = x
      x = y
      y = tmp
    }
    x += s * rx
    y += s * ry
    t = t >> 2
  }
  out[0] = x
  out[1] = y
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const trailCols: P5.Color[] = []
  let xs = new Float32Array(0)
  let ys = new Float32Array(0)
  let oi = 0
  let head = 0
  let speed = 4

  const layout = () => {
    const n = 1 << ORDERS[oi]!
    const total = n * n
    xs = new Float32Array(total)
    ys = new Float32Array(total)
    const cell = (Math.min(p.width, p.height) * 0.9) / n
    const ox = (p.width - cell * n) / 2
    const oy = (p.height - cell * n) / 2
    const cur = [0, 0]
    for (let d = 0; d < total; d++) {
      d2xy(n, d, cur)
      xs[d] = ox + (cur[0]! + 0.5) * cell
      ys[d] = oy + (cur[1]! + 0.5) * cell
    }
    speed = Math.max(1, Math.round(total / LAP_FRAMES))
    head = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    const cold = p.color(pal.dim)
    const hot = p.color(pal.signal)
    for (let i = 0; i < TRAIL; i++) {
      const u = i / (TRAIL - 1)
      const c = p.lerpColor(cold, hot, u)
      c.setAlpha(20 + 215 * u * u)
      trailCols.push(c)
    }
    oi = Math.floor(p.random(ORDERS.length))
    p.noFill()
    layout()
  }

  p.draw = () => {
    p.background(pal.bg)

    const base = p.color(pal.dim)
    base.setAlpha(46)
    p.stroke(base)
    p.strokeWeight(1)
    p.beginShape()
    for (let i = 0; i < xs.length; i++) p.vertex(xs[i]!, ys[i]!)
    p.endShape()

    p.strokeWeight(1.8)
    const start = Math.max(0, head - TRAIL + 1)
    for (let i = start; i < head; i++) {
      p.stroke(trailCols[i - head + TRAIL - 1]!)
      p.line(xs[i]!, ys[i]!, xs[i + 1]!, ys[i + 1]!)
    }

    const hx = xs[head]!
    const hy = ys[head]!
    for (let g = 3; g >= 1; g--) {
      const glow = p.color(pal.accent)
      glow.setAlpha(g === 1 ? 240 : 60 / g)
      p.stroke(glow)
      p.strokeWeight(g * 3.4)
      p.point(hx, hy)
    }

    head += speed
    if (head >= xs.length - 1) {
      oi = (oi + 1) % ORDERS.length
      layout()
    }
  }
}
