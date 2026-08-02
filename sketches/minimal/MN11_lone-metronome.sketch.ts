import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const size = Math.min(ctx.width, ctx.height)
    const phase = (p.frameCount % 180) / 180
    const triangle = 1 - 4 * Math.abs(phase - 0.5)
    const angle = triangle * 0.48
    const pivotX = ctx.width / 2
    const pivotY = ctx.height / 2 - size * 0.12
    const length = size * 0.28
    const endX = pivotX + Math.sin(angle) * length
    const endY = pivotY + Math.cos(angle) * length

    p.stroke(ctx.palette.signal)
    p.strokeWeight(size * 0.008)
    p.line(pivotX, pivotY, endX, endY)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(pivotX, pivotY, size * 0.023)
    p.fill(ctx.palette.paper)
    p.circle(endX, endY, size * 0.012)
  }
}
