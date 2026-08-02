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
    const time = p.frameCount * 0.018
    const wobble = Math.sin(time) * 0.115
    const centerX = ctx.width / 2
    const centerY = ctx.height / 2
    const halfLength = size * 0.29

    p.stroke(ctx.palette.signal)
    p.strokeWeight(size * 0.007)
    p.line(
      centerX - Math.cos(wobble) * halfLength,
      centerY - Math.sin(wobble) * halfLength,
      centerX + Math.cos(wobble) * halfLength,
      centerY + Math.sin(wobble) * halfLength,
    )
    const vertical = Math.PI / 2 - wobble
    p.stroke(ctx.palette.paper)
    p.strokeWeight(size * 0.004)
    p.line(
      centerX - Math.cos(vertical) * halfLength,
      centerY - Math.sin(vertical) * halfLength,
      centerX + Math.cos(vertical) * halfLength,
      centerY + Math.sin(vertical) * halfLength,
    )
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(centerX, centerY, size * 0.018)
  }
}
