import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const cx = ctx.width * 0.5
    const cy = ctx.height * 0.5
    const limit = Math.min(ctx.width, ctx.height) * 0.46
    const rotation = p.frameCount * 0.012
    p.noFill()

    for (let crest = 0; crest < 12; crest++) {
      const color = p.color(crest % 6 === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(70 + crest * 10)
      p.stroke(color)
      p.strokeWeight(crest % 6 === 0 ? 2 : 1.15)
      p.beginShape()
      for (let step = 0; step <= 220; step++) {
        const theta = step / 220 * p.TWO_PI * 2.7
        const radius = 4 + crest * 17 + theta * 8.4
        if (radius <= limit) {
          const angle = theta + rotation + crest * 0.035
          p.vertex(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
        }
      }
      p.endShape()
    }

    p.stroke(ctx.palette.dim)
    for (let spoke = 0; spoke < 8; spoke++) {
      const angle = rotation + spoke * p.TWO_PI / 8
      p.line(cx + Math.cos(angle) * 18, cy + Math.sin(angle) * 18, cx + Math.cos(angle) * limit, cy + Math.sin(angle) * limit)
    }
    p.fill(ctx.palette.accent)
    p.noStroke()
    p.circle(cx, cy, 12)
    p.fill(ctx.palette.paper)
    p.circle(cx, cy, 3)
  }
}
