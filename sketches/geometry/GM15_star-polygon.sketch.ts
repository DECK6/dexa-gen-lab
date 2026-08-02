import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const VERTICES = 11
const K_COUNT = 5

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    phase = p.random(p.TWO_PI)
  }

  const polygon = (k: number, radius: number, rot: number, alpha: number, hot: boolean) => {
    const line = p.color(hot ? pal.accent : pal.signal)
    line.setAlpha(alpha)
    p.stroke(line)
    p.strokeWeight(hot ? 1.65 : 1.05)
    p.beginShape()
    let vertex = 0
    for (let i = 0; i <= VERTICES; i++) {
      const a = (vertex / VERTICES) * p.TWO_PI + rot
      p.vertex(p.cos(a) * radius, p.sin(a) * radius)
      vertex = (vertex + k) % VERTICES
    }
    p.endShape()
  }

  p.draw = () => {
    p.background(pal.bg)
    p.translate(p.width / 2, p.height / 2)
    const q = p.frameCount / 72
    const step = p.floor(q)
    const mix = q - step
    const k0 = 1 + (step % K_COUNT)
    const k1 = 1 + ((step + 1) % K_COUNT)
    const rot = phase + p.frameCount * 0.0025
    const radius = p.min(p.width, p.height) * 0.43

    for (let layer = 0; layer < 3; layer++) {
      const r = radius * (1 - layer * 0.12)
      polygon(k0, r, rot + layer * 0.035, 155 * (1 - mix), false)
      polygon(k1, r, rot + layer * 0.035, 155 * mix, layer === 1)
    }

    const marks = p.color(pal.paper)
    marks.setAlpha(135)
    p.stroke(marks)
    p.strokeWeight(2.2)
    for (let i = 0; i < VERTICES; i++) {
      const a = (i / VERTICES) * p.TWO_PI + rot
      p.point(p.cos(a) * radius, p.sin(a) * radius)
    }
  }
}
