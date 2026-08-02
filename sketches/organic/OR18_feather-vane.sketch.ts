import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const BARBS = 46

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let lean = 0
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    lean = p.random(-0.08, 0.08)
    phase = p.random(p.TWO_PI)
    p.strokeCap(p.ROUND)
  }

  const axis = (u: number) => ({
    x: p.width * (0.48 + lean * u + 0.045 * Math.sin(u * p.PI)),
    y: p.height * (0.88 - u * 0.76),
  })

  p.draw = () => {
    p.background(pal.bg)
    const shaft = p.color(pal.signal)
    const barb = p.color(pal.signal)
    shaft.setAlpha(210)
    p.noFill()
    p.stroke(shaft)
    p.strokeWeight(3.4)
    p.beginShape()
    for (let i = 0; i <= BARBS; i++) {
      const q = axis(i / BARBS)
      p.vertex(q.x, q.y)
    }
    p.endShape()

    for (let i = 3; i < BARBS; i++) {
      const u = i / BARBS
      const q = axis(u)
      const prev = axis(u - 1 / BARBS)
      const tangent = Math.atan2(q.y - prev.y, q.x - prev.x)
      const envelope = Math.pow(Math.sin(u * p.PI), 0.62) * p.width * 0.24
      for (const side of [-1, 1]) {
        const rake = side * (1.12 - u * 0.36)
        const flutter = Math.sin(p.frameCount * 0.035 - i * 0.22 + phase) * 0.055 * (0.3 + u)
        const a = tangent + rake + flutter
        const len = envelope * (side < 0 ? 0.92 : 1)
        const ex = q.x + Math.cos(a) * len
        const ey = q.y + Math.sin(a) * len
        barb.setAlpha(55 + u * 105)
        p.stroke(barb)
        p.strokeWeight(0.8 + (1 - u) * 0.35)
        p.line(q.x, q.y, ex, ey)
        if (i % 2 === 0) {
          barb.setAlpha(38)
          p.stroke(barb)
          p.line(p.lerp(q.x, ex, 0.6), p.lerp(q.y, ey, 0.6), p.lerp(q.x, ex, 0.92), p.lerp(q.y, ey, 0.92) + side * 3)
        }
      }
    }
    const tip = axis(1)
    const hot = p.color(pal.accent)
    hot.setAlpha(220)
    p.noStroke()
    p.fill(hot)
    p.ellipse(tip.x, tip.y, 4)
  }
}
