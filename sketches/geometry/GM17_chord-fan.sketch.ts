import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const POINTS = 72
const FANS = 3

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    phase = p.random(p.TWO_PI)
  }

  p.draw = () => {
    p.background(pal.bg)
    p.translate(p.width / 2, p.height / 2)
    p.rotate(p.frameCount * 0.0018)
    const radius = p.min(p.width, p.height) * 0.43
    const t = p.frameCount * 0.021 + phase

    const rim = p.color(pal.dim)
    rim.setAlpha(120)
    p.stroke(rim)
    p.strokeWeight(1)
    p.circle(0, 0, radius * 2)

    for (let fan = 0; fan < FANS; fan++) {
      const pivot = fan * (POINTS / FANS)
      const opening = 0.5 + 0.5 * p.sin(t + fan * p.TWO_PI / FANS)
      const count = 8 + p.floor(opening * 30)
      const a0 = (pivot / POINTS) * p.TWO_PI
      const x0 = p.cos(a0) * radius
      const y0 = p.sin(a0) * radius
      for (let j = 1; j <= count; j++) {
        const index = (pivot + j * 2) % POINTS
        const a1 = (index / POINTS) * p.TWO_PI
        const hot = j === count
        const line = p.color(hot ? pal.accent : pal.signal)
        line.setAlpha(hot ? 220 : 55 + (j / count) * 65)
        p.stroke(line)
        p.strokeWeight(hot ? 1.7 : 1)
        p.line(x0, y0, p.cos(a1) * radius, p.sin(a1) * radius)
      }
    }

    const points = p.color(pal.paper)
    points.setAlpha(120)
    p.stroke(points)
    p.strokeWeight(2)
    for (let i = 0; i < POINTS; i += 3) {
      const a = (i / POINTS) * p.TWO_PI
      p.point(p.cos(a) * radius, p.sin(a) * radius)
    }
  }
}
