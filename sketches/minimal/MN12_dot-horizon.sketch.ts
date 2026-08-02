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
    const horizonY = ctx.height * 0.56
    const phaseFrame = ((p.frameCount + ctx.seed % 120) % 240 + 240) % 240
    const phase = phaseFrame / 240
    const dotY = horizonY - Math.sin(phase * p.TWO_PI) * size * 0.19
    const dotX = ctx.width / 2 + Math.cos(phase * p.TWO_PI) * size * 0.035

    p.stroke(ctx.palette.signal)
    p.strokeWeight(size * 0.004)
    p.line(size * 0.19, horizonY, ctx.width - size * 0.19, horizonY)
    p.noStroke()
    p.fill(ctx.palette.signal)
    p.circle(dotX, dotY, size * 0.032)
    p.fill(ctx.palette.accent)
    p.rectMode(p.CENTER)
    p.rect(dotX, horizonY, size * 0.018, size * 0.006)
  }
}
