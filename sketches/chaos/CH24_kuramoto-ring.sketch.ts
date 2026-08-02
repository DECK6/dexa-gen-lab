import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 96
const RANGE = 16

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const phase = new Array<number>(N)
  const next = new Array<number>(N)
  const omega = new Array<number>(N)

  const scatter = () => {
    for (let i = 0; i < N; i++) {
      const wave = (i / N) * p.TWO_PI * 3
      phase[i] = i < N / 2 ? wave + p.random(-0.12, 0.12) : p.random(p.TWO_PI)
      omega[i] = 0.055 + p.random(-0.004, 0.004)
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    scatter()
  }

  p.draw = () => {
    p.background(pal.bg)
    for (let i = 0; i < N; i++) {
      let coupling = 0
      for (let d = 1; d <= RANGE; d++) {
        coupling += Math.sin(phase[(i + d) % N] - phase[i] - 1.42)
        coupling += Math.sin(phase[(i - d + N) % N] - phase[i] - 1.42)
      }
      next[i] = phase[i] + omega[i] + (0.085 * coupling) / (2 * RANGE)
    }
    for (let i = 0; i < N; i++) phase[i] = next[i]
    const cx = p.width / 2
    const cy = p.height / 2
    const base = Math.min(p.width, p.height) * 0.31
    const ring = p.color(pal.signal)
    ring.setAlpha(210)
    p.noFill()
    p.stroke(ring)
    p.strokeWeight(1.4)
    p.beginShape()
    for (let i = 0; i <= N; i++) {
      const j = i % N
      const a = j * p.TWO_PI / N - p.HALF_PI
      const r = base + Math.sin(phase[j]) * base * 0.17
      p.vertex(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    }
    p.endShape()
    for (let i = 0; i < N; i += 3) {
      const a = i * p.TWO_PI / N - p.HALF_PI
      const r = base + Math.sin(phase[i]) * base * 0.17
      let local = 0
      for (let d = 1; d <= 3; d++) local += Math.cos(phase[(i + d) % N] - phase[i])
      p.noStroke()
      p.fill(local < 1 ? pal.accent : pal.signal)
      p.circle(cx + Math.cos(a) * r, cy + Math.sin(a) * r, local < 1 ? 5 : 3)
    }
    if (p.frameCount % 960 === 0) scatter()
  }
}
