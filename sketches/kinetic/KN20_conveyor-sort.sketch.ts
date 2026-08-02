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
    const beltY = ctx.height * 0.55
    const gateX = ctx.width * 0.57
    p.stroke(ctx.palette.signal)
    p.strokeWeight(3)
    p.line(ctx.width * 0.08, beltY - 22, ctx.width * 0.92, beltY - 22)
    p.line(ctx.width * 0.08, beltY + 22, ctx.width * 0.92, beltY + 22)
    p.line(gateX, beltY - 22, ctx.width * 0.86, ctx.height * 0.27)
    p.line(gateX, beltY + 22, ctx.width * 0.86, ctx.height * 0.83)
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    for (let i = 0; i < 14; i++) {
      const x = ctx.width * 0.08 + ((i * 48 + p.frameCount * 2.2) % (ctx.width * 0.84))
      p.line(x, beltY - 20, x + 18, beltY + 20)
    }
    const activeType = Math.floor(p.frameCount * 0.018) % 3
    const flapAngle = activeType === 0 ? -0.72 : activeType === 1 ? 0.72 : 0
    p.stroke(ctx.palette.accent)
    p.strokeWeight(7)
    p.line(gateX, beltY, gateX + Math.cos(flapAngle) * size * 0.105, beltY + Math.sin(flapAngle) * size * 0.105)
    p.rectMode(p.CENTER)
    for (let i = 0; i < 10; i++) {
      const progress = (i / 10 + p.frameCount * 0.0038) % 1
      let x = ctx.width * 0.04 + progress * ctx.width * 0.92
      let y = beltY
      if (x > gateX) {
        const branch = Math.min(1, (x - gateX) / (ctx.width * 0.29))
        if (i % 3 === 0) y -= branch * ctx.height * 0.28
        if (i % 3 === 1) y += branch * ctx.height * 0.28
        x -= Math.sin(branch * p.PI) * size * 0.035
      }
      p.noStroke()
      p.fill(i % 3 === 0 ? ctx.palette.accent : i % 3 === 1 ? ctx.palette.paper : ctx.palette.signal)
      p.rect(x, y - 18, size * 0.055, size * 0.045, 3)
      p.fill(ctx.palette.ink)
      p.rect(x, y - 18, 9, 4)
    }
    p.noFill()
    p.stroke(ctx.palette.paper)
    p.strokeWeight(2)
    p.rect(ctx.width * 0.88, ctx.height * 0.25, size * 0.1, size * 0.12)
    p.rect(ctx.width * 0.88, ctx.height * 0.85, size * 0.1, size * 0.12)
  }
}
