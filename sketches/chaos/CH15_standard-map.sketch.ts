import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Phase { q: number; m: number; family: number }
const N = 1600

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const points: Phase[] = []
  const wrap = (v: number) => ((v % p.TWO_PI) + p.TWO_PI) % p.TWO_PI

  const step = (o: Phase, k: number) => {
    o.m = wrap(o.m + k * Math.sin(o.q))
    o.q = wrap(o.q + o.m)
  }

  const scatter = () => {
    points.length = 0
    for (let i = 0; i < N; i++) {
      const family = i % 5
      const q = p.TWO_PI * ((i / 5) % 320) / 320
      const m = family === 0 ? p.random(-0.04, 0.04) : family * p.TWO_PI / 5 + p.random(-0.025, 0.025)
      const o = { q, m: wrap(m), family }
      for (let j = 0; j < i % 55; j++) step(o, 0.972)
      points.push(o)
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    scatter()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(32)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    const k = 0.972 + 0.035 * Math.sin(p.frameCount * 0.003)
    const phase = p.color(pal.signal)
    phase.setAlpha(92)
    p.stroke(phase)
    p.strokeWeight(1.1)
    const pad = Math.min(p.width, p.height) * 0.07
    for (let i = 0; i < points.length; i++) {
      const o = points[i]
      step(o, k)
      p.point(pad + (o.q / p.TWO_PI) * (p.width - 2 * pad), pad + (1 - o.m / p.TWO_PI) * (p.height - 2 * pad))
    }
    const frame = p.color(pal.dim)
    frame.setAlpha(150)
    p.noFill()
    p.stroke(frame)
    p.strokeWeight(1)
    p.rect(pad, pad, p.width - 2 * pad, p.height - 2 * pad)
    p.stroke(pal.accent)
    const scan = pad + ((p.frameCount % 360) / 360) * (p.width - 2 * pad)
    p.line(scan, p.height - pad, scan, p.height - pad + 7)
    if (p.frameCount % 1200 === 0) scatter()
  }
}
