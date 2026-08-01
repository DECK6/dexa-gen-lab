import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const VARIANT = 1

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    p.translate(ctx.width / 2, ctx.height / 2)
    const t = p.frameCount * 0.009
    p.noFill()
    for (let ring = 0; ring < 34; ring++) {
      const radius = 20 + ring * (7 + VARIANT * 0.45)
      const wobble = Math.sin(t * (1 + VARIANT * 0.05) + ring * 0.37) * (4 + VARIANT)
      const color = p.color(ring % (3 + VARIANT % 4) === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(55 + ring * 4)
      p.stroke(color)
      p.strokeWeight(ring % 6 === 0 ? 2 : 1)
      p.push()
      p.rotate(t * (ring % 2 ? 0.08 : -0.06) + VARIANT * 0.17)
      p.ellipse(wobble, 0, radius * 2, radius * (1.15 + (VARIANT % 4) * 0.13))
      p.pop()
    }
    const rays = 18 + VARIANT * 2
    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * p.TWO_PI + t * 0.13
      const inner = 36 + Math.sin(t * 1.7 + i) * 12
      const outer = ctx.width * 0.58
      p.stroke(i % 5 === 0 ? ctx.palette.paper : ctx.palette.dim)
      p.line(Math.cos(angle) * inner, Math.sin(angle) * inner, Math.cos(angle) * outer, Math.sin(angle) * outer)
    }
  }
}
