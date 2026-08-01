import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

// x'' + d x' - x + x^3 = g cos(w t) — the ensemble loop is stretched and folded
const M = 150
const H = 0.004
const SUB = 20
const DELTA = 0.3
const OMEGA = 1.2
const LIFE = 420

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const xs: number[] = []
  const vs: number[] = []
  let t = 0
  let cx = 0
  let cy = 0
  let sx = 0
  let sy = 0
  let age = 0

  const reset = () => {
    xs.length = 0
    vs.length = 0
    const ox = p.random(-1.2, 1.2)
    const ov = p.random(-0.7, 0.7)
    for (let i = 0; i < M; i++) {
      const a = (i / M) * p.TWO_PI
      xs.push(ox + Math.cos(a) * 0.05)
      vs.push(ov + Math.sin(a) * 0.05)
    }
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    cx = p.width / 2
    cy = p.height / 2
    sx = Math.min(p.width, p.height) * 0.26
    sy = Math.min(p.width, p.height) * 0.3
    p.strokeWeight(1)
    reset()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(3)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const gamma = 0.5 + 0.06 * Math.sin(p.frameCount * 0.0013)
    for (let n = 0; n < SUB; n++) {
      const drive = gamma * Math.cos(OMEGA * t)
      for (let i = 0; i < M; i++) {
        const x = xs[i]
        const nv = vs[i] + H * (-DELTA * vs[i] + x - x * x * x + drive)
        vs[i] = nv
        xs[i] = x + H * nv
      }
      t += H
    }

    const cyan = p.color(pal.signal)
    cyan.setAlpha(26)
    p.stroke(cyan)
    const cut = p.width * 0.35
    for (let i = 0; i < M; i++) {
      const j = (i + 1) % M
      const ax = cx + xs[i] * sx
      const ay = cy - vs[i] * sy
      const bx = cx + xs[j] * sx
      const by = cy - vs[j] * sy
      if (Math.abs(ax - bx) + Math.abs(ay - by) < cut) p.line(ax, ay, bx, by)
    }

    const mark = p.color(pal.accent)
    mark.setAlpha(120)
    p.stroke(mark)
    p.strokeWeight(2)
    p.point(cx + xs[0] * sx, cy - vs[0] * sy)
    p.strokeWeight(1)

    age++
    if (age > LIFE || !Number.isFinite(xs[0])) reset()
  }
}
