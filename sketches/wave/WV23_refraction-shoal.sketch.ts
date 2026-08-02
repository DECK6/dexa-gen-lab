import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const left = ctx.width * 0.08
    const top = ctx.height * 0.08
    const width = ctx.width * 0.76
    const height = ctx.height * 0.84
    const linear = 4.5
    const shoal = 12
    const transverse = 3.8
    const drift = p.frameCount * 0.045 % 1.15

    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    for (let band = 0; band <= 6; band++) {
      const x = left + width * band / 6
      p.line(x, top, x, top + height)
    }

    p.noFill()
    for (let crest = -4; crest < 22; crest++) {
      const target = crest * 1.15 + drift
      p.stroke(crest % 5 === 0 ? ctx.palette.accent : ctx.palette.signal)
      p.strokeWeight(crest % 5 === 0 ? 2 : 1.35)
      p.beginShape()
      for (let step = 0; step <= 100; step++) {
        const y = step / 100 - 0.5
        const discriminant = linear * linear + 4 * shoal * (target - transverse * y)
        if (discriminant >= 0) {
          const x = (-linear + Math.sqrt(discriminant)) / (2 * shoal)
          if (x >= 0 && x <= 1) p.vertex(left + x * width, top + (y + 0.5) * height)
        }
      }
      p.endShape()

      const nearShore = 0.94
      const breakY = (target - linear * nearShore - shoal * nearShore * nearShore) / transverse
      if (breakY >= -0.5 && breakY <= 0.5) {
        p.fill(ctx.palette.accent)
        p.noStroke()
        p.circle(left + nearShore * width, top + (breakY + 0.5) * height, 6)
        p.noFill()
      }
    }
    p.stroke(ctx.palette.paper)
    p.strokeWeight(4)
    p.line(left + width, top - 5, left + width, top + height + 5)
    p.stroke(ctx.palette.accent)
    p.strokeWeight(1)
    p.line(left + width + 10, top, left + width + 10, top + height)
  }
}
