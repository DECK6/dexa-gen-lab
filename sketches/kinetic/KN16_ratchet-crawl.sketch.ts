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
    const x = ctx.width * 0.48
    const y = ctx.height * 0.48
    const outer = size * 0.2
    const inner = outer * 0.79
    const teeth = 18
    const step = p.TWO_PI / teeth
    const crawl = p.frameCount * 0.06
    const index = Math.floor(crawl)
    const phase = crawl - index
    const engaged = Math.min(1, phase / 0.3)
    const ease = engaged * engaged * (3 - 2 * engaged)
    const angle = (index + ease) * step
    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(3)
    p.beginShape()
    for (let i = 0; i < teeth; i++) {
      const rootAngle = angle + i * step
      const tipAngle = rootAngle + step * 0.68
      p.vertex(x + Math.cos(rootAngle) * inner, y + Math.sin(rootAngle) * inner)
      p.vertex(x + Math.cos(tipAngle) * outer, y + Math.sin(tipAngle) * outer)
    }
    p.endShape(p.CLOSE)
    p.stroke(ctx.palette.dim)
    p.circle(x, y, inner * 1.45)
    for (let i = 0; i < 6; i++) {
      const spoke = angle + (i * p.TWO_PI) / 6
      p.line(x, y, x + Math.cos(spoke) * inner * 0.7, y + Math.sin(spoke) * inner * 0.7)
    }
    const contactAngle = -0.72
    const lift = Math.sin(Math.min(1, phase / 0.3) * p.PI) * size * 0.025
    const contactX = x + Math.cos(contactAngle) * outer
    const contactY = y + Math.sin(contactAngle) * outer - lift
    const pivotX = x + size * 0.24
    const pivotY = y - size * 0.25
    p.stroke(ctx.palette.paper)
    p.strokeWeight(7)
    p.line(pivotX, pivotY, contactX, contactY)
    p.stroke(ctx.palette.accent)
    p.strokeWeight(3)
    p.line(contactX, contactY, contactX - 22, contactY + 16)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(pivotX, pivotY, 13)
    p.fill(ctx.palette.ink)
    p.stroke(ctx.palette.signal)
    p.circle(x, y, 20)
    const trackY = ctx.height * 0.82
    p.stroke(ctx.palette.dim)
    p.line(ctx.width * 0.16, trackY, ctx.width * 0.84, trackY)
    for (let i = 0; i < 12; i++) {
      const offset = (i * 54 + angle * outer) % (ctx.width * 0.68)
      p.line(ctx.width * 0.16 + offset, trackY - 7, ctx.width * 0.16 + offset + 16, trackY)
    }
  }
}
