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
    const local = (p.frameCount % 240) / 240
    const angle = 0.42 * Math.exp(-1.5 * local) * Math.cos(local * 5 * Math.PI)
    const centerX = ctx.width / 2
    const centerY = ctx.height / 2
    const halfLength = size * 0.27
    const dx = Math.cos(angle) * halfLength
    const dy = Math.sin(angle) * halfLength

    const guide = p.color(ctx.palette.dim)
    guide.setAlpha(100)
    p.stroke(guide)
    p.strokeWeight(size * 0.002)
    p.line(centerX - halfLength, centerY, centerX + halfLength, centerY)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(size * 0.01)
    p.line(centerX - dx, centerY - dy, centerX + dx, centerY + dy)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.triangle(
      centerX,
      centerY,
      centerX - size * 0.025,
      centerY + size * 0.055,
      centerX + size * 0.025,
      centerY + size * 0.055,
    )
  }
}
