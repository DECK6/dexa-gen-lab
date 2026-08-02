import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const size = Math.min(ctx.width, ctx.height)
    const phase = (p.frameCount % 240) / 240
    const depth = size * 0.18 * (0.5 - 0.5 * Math.cos(phase * p.TWO_PI))
    const left = ctx.width / 2 - size * 0.31
    const right = ctx.width / 2 + size * 0.31
    const top = ctx.height / 2 - size * 0.31
    const bottom = ctx.height / 2 + size * 0.31
    const paper = p.color(ctx.palette.paper)
    paper.setAlpha(24)

    p.fill(paper)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(size * 0.004)
    p.beginShape()
    p.vertex(left, top)
    p.vertex(right - depth, top)
    p.vertex(right, top + depth)
    p.vertex(right, bottom)
    p.vertex(left, bottom)
    p.endShape(p.CLOSE)

    const flap = p.color(ctx.palette.paper)
    flap.setAlpha(150)
    p.fill(flap)
    p.stroke(ctx.palette.signal)
    p.triangle(right - depth, top, right - depth, top + depth, right, top + depth)
    p.stroke(ctx.palette.accent)
    p.line(right - depth, top, right, top + depth)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(right - depth, top + depth, size * 0.012)
  }
}
