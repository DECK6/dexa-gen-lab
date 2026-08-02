import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const cx = ctx.width * 0.5
    const cy = ctx.height * 0.5
    const horizontal = size * 0.31
    const vertical = size * 0.24
    const ratio = 0.58
    const angle = p.frameCount * 0.028
    const sliderX = cx + Math.cos(angle) * horizontal
    const sliderY = cy + Math.sin(angle) * vertical
    const tracerX = p.lerp(sliderX, cx, ratio)
    const tracerY = p.lerp(cy, sliderY, ratio)
    p.stroke(ctx.palette.dim)
    p.strokeWeight(10)
    p.line(cx - horizontal - 28, cy, cx + horizontal + 28, cy)
    p.line(cx, cy - vertical - 28, cx, cy + vertical + 28)
    p.stroke(ctx.palette.ink)
    p.strokeWeight(4)
    p.line(cx - horizontal - 28, cy, cx + horizontal + 28, cy)
    p.line(cx, cy - vertical - 28, cx, cy + vertical + 28)
    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.ellipse(cx, cy, horizontal * (1 - ratio) * 2, vertical * ratio * 2)
    p.stroke(ctx.palette.paper)
    p.strokeWeight(6)
    p.line(sliderX, cy, cx, sliderY)
    p.rectMode(p.CENTER)
    p.fill(ctx.palette.ink)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.rect(sliderX, cy, 30, 20, 3)
    p.rect(cx, sliderY, 20, 30, 3)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(tracerX, tracerY, 12)
    p.stroke(ctx.palette.accent)
    p.strokeWeight(1)
    p.line(tracerX - 12, tracerY, tracerX + 12, tracerY)
    p.line(tracerX, tracerY - 12, tracerX, tracerY + 12)
  }
}
