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
    const centerX = ctx.width / 2
    const wallY = ctx.height * 0.58
    const solarAngle = Math.sin(p.frameCount * 0.012) * 0.68
    const tipX = centerX + Math.tan(solarAngle) * size * 0.36
    const shadow = p.color(ctx.palette.signal)
    shadow.setAlpha(92)

    p.stroke(ctx.palette.paper)
    p.strokeWeight(size * 0.004)
    p.line(size * 0.16, wallY, ctx.width - size * 0.16, wallY)
    p.noStroke()
    p.fill(shadow)
    p.triangle(centerX, wallY, centerX + size * 0.032, wallY, tipX, wallY + size * 0.072)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(size * 0.008)
    p.line(centerX, wallY, centerX, wallY - size * 0.18)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(tipX, wallY + size * 0.072, size * 0.02)
  }
}
