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
    const phase = (p.frameCount % 240) / 240
    const origin = -Math.PI / 2
    const start = phase < 0.5 ? origin : origin + (phase - 0.5) * 4 * Math.PI
    const end = phase < 0.5 ? origin + phase * 4 * Math.PI : origin + p.TWO_PI
    const diameter = size * 0.42
    const centerX = ctx.width / 2
    const centerY = ctx.height / 2
    const tipAngle = phase < 0.5 ? end : start

    const ghost = p.color(ctx.palette.dim)
    ghost.setAlpha(80)
    p.noFill()
    p.stroke(ghost)
    p.strokeWeight(size * 0.003)
    p.circle(centerX, centerY, diameter)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(size * 0.012)
    p.arc(centerX, centerY, diameter, diameter, start, end)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(
      centerX + Math.cos(tipAngle) * diameter / 2,
      centerY + Math.sin(tipAngle) * diameter / 2,
      size * 0.018,
    )
  }
}
