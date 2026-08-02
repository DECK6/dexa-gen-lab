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
    const cx = ctx.width * 0.38
    const cy = ctx.height * 0.4
    const radius = size * 0.13
    const angle = p.frameCount * 0.035
    const pinX = cx + Math.cos(angle) * radius
    const pinY = cy + Math.sin(angle) * radius
    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(3)
    p.circle(cx, cy, radius * 2)
    for (let i = 0; i < 8; i++) {
      const spoke = angle + (i * p.TWO_PI) / 8
      p.line(cx, cy, cx + Math.cos(spoke) * radius * 0.88, cy + Math.sin(spoke) * radius * 0.88)
    }
    p.rectMode(p.CENTER)
    p.stroke(ctx.palette.paper)
    p.strokeWeight(5)
    p.rect(pinX, cy, size * 0.16, size * 0.36, 8)
    p.stroke(ctx.palette.dim)
    p.strokeWeight(12)
    p.line(pinX, cy - radius * 1.15, pinX, cy + radius * 1.15)
    p.stroke(ctx.palette.ink)
    p.strokeWeight(5)
    p.line(pinX, cy - radius * 1.15, pinX, cy + radius * 1.15)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(8)
    p.line(pinX + size * 0.08, cy, ctx.width * 0.88, cy)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(pinX, pinY, 14)
    p.fill(ctx.palette.paper)
    p.circle(cx, cy, 12)
    const traceY = ctx.height * 0.79
    const traceLeft = ctx.width * 0.15
    const traceWidth = ctx.width * 0.7
    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.beginShape()
    for (let i = 0; i <= 90; i++) p.vertex(traceLeft + (i / 90) * traceWidth, traceY + Math.cos((i / 90) * p.TWO_PI) * size * 0.045)
    p.endShape()
    const phase = (angle % p.TWO_PI) / p.TWO_PI
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(traceLeft + phase * traceWidth, traceY + Math.cos(angle) * size * 0.045, 9)
  }
}
