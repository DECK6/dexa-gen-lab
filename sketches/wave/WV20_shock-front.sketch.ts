import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const cycle = p.frameCount % 260
    const speed = ctx.width * 0.64 / 260
    const waveSpeed = speed / 1.7
    const machAngle = Math.asin(waveSpeed / speed)
    const slope = Math.tan(machAngle)
    const sx = ctx.width * 0.18 + speed * cycle
    const cy = ctx.height * 0.5
    const maxAge = 185
    const projection = 1 / (1 + slope * slope)
    const tailX = sx - speed * maxAge * projection
    const tailY = slope * speed * maxAge * projection

    const cone = p.color(ctx.palette.signal)
    cone.setAlpha(22)
    p.fill(cone)
    p.noStroke()
    p.triangle(sx, cy, tailX, cy - tailY, tailX, cy + tailY)

    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2.5)
    p.line(sx, cy, tailX, cy - tailY)
    p.line(sx, cy, tailX, cy + tailY)
    p.stroke(ctx.palette.accent)
    p.strokeWeight(2)
    for (let age = 12; age <= maxAge; age += 12) {
      const x = sx - speed * age * projection
      const y = slope * speed * age * projection
      p.point(x, cy - y)
      p.point(x, cy + y)
    }

    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    p.line(ctx.width * 0.05, cy, ctx.width * 0.95, cy)
    for (let age = 20; age <= maxAge; age += 20) {
      const emittedX = sx - speed * age
      p.line(emittedX, cy - 5, emittedX, cy + 5)
    }
    p.fill(ctx.palette.accent)
    p.noStroke()
    p.triangle(sx + 14, cy, sx - 10, cy - 9, sx - 10, cy + 9)
    p.fill(ctx.palette.paper)
    p.circle(sx, cy, 4)
  }
}
