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
    const phase = (p.frameCount / 240) * p.TWO_PI
    const approach = (1 + Math.cos(phase)) / 2
    const gap = (1 - approach) * size * 0.13
    const tilt = (1 - approach) * 0.17
    const centerX = ctx.width / 2
    const centerY = ctx.height / 2
    const length = size * 0.25
    const leftX = centerX - gap
    const rightX = centerX + gap

    p.stroke(ctx.palette.signal)
    p.strokeWeight(size * 0.008)
    p.line(leftX, centerY, leftX - Math.cos(tilt) * length, centerY + Math.sin(tilt) * length)
    p.stroke(ctx.palette.paper)
    p.strokeWeight(size * 0.005)
    p.line(rightX, centerY, rightX + Math.cos(tilt) * length, centerY + Math.sin(tilt) * length)

    if (approach > 0.72) {
      p.noStroke()
      p.fill(ctx.palette.accent)
      p.circle(centerX, centerY, size * 0.022 * approach)
    }
  }
}
