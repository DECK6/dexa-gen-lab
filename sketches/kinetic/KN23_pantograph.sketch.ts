import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Point = { x: number; y: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const origin = { x: ctx.width * 0.13, y: ctx.height * 0.5 }
    const scale = 2.65
    const vector = (angle: number): Point => ({
      x: size * (0.145 + Math.cos(angle) * 0.045 + Math.cos(angle * 3) * 0.018),
      y: size * (Math.sin(angle) * 0.055 + Math.sin(angle * 2) * 0.026),
    })
    const point = (angle: number, amount: number): Point => {
      const v = vector(angle)
      return { x: origin.x + v.x * amount, y: origin.y + v.y * amount }
    }
    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(2)
    for (const amount of [1, scale]) {
      p.beginShape()
      for (let i = 0; i <= 120; i++) {
        const traced = point((i / 120) * p.TWO_PI, amount)
        p.vertex(traced.x, traced.y)
      }
      p.endShape()
    }
    const angle = p.frameCount * 0.024
    const v = vector(angle)
    const length = Math.sqrt(v.x * v.x + v.y * v.y)
    const normal = { x: (-v.y / length) * size * 0.055, y: (v.x / length) * size * 0.055 }
    const tracer = point(angle, 1)
    const output = point(angle, scale)
    const near = { x: origin.x + v.x * 0.62 + normal.x, y: origin.y + v.y * 0.62 + normal.y }
    const far = { x: origin.x + v.x * 1.82 + normal.x, y: origin.y + v.y * 1.82 + normal.y }
    p.stroke(ctx.palette.signal)
    p.strokeWeight(4)
    p.line(origin.x, origin.y, far.x, far.y)
    p.line(near.x, near.y, output.x, output.y)
    p.line(near.x, near.y, far.x, far.y)
    p.line(tracer.x, tracer.y, output.x, output.y)
    p.stroke(ctx.palette.paper)
    p.strokeWeight(2)
    p.line(origin.x, origin.y, tracer.x, tracer.y)
    p.noStroke()
    for (const joint of [origin, near, far, tracer]) {
      p.fill(ctx.palette.paper)
      p.circle(joint.x, joint.y, 9)
    }
    p.fill(ctx.palette.accent)
    p.circle(output.x, output.y, 12)
    p.stroke(ctx.palette.accent)
    p.strokeWeight(1)
    p.line(output.x, output.y, output.x, output.y + 18)
  }
}
