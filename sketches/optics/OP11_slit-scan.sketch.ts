import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SLITS = 52

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.strokeCap(p.SQUARE)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    const left = ctx.width * 0.1
    const span = ctx.width * 0.8
    const slitWidth = span / SLITS
    const trace = p.color(ctx.palette.signal)
    trace.setAlpha(210)

    p.noFill()
    p.stroke(ctx.palette.dim)
    p.line(left, ctx.height * 0.2, left, ctx.height * 0.8)
    p.line(left + span, ctx.height * 0.2, left + span, ctx.height * 0.8)

    for (let band = -1; band <= 1; band++) {
      p.beginShape()
      if (band === 0) p.stroke(trace)
      else p.stroke(ctx.palette.dim)
      p.strokeWeight(band === 0 ? 2.2 : 1)
      for (let i = 0; i <= SLITS; i++) {
        const history = t - (SLITS - i) * 0.045
        const y = ctx.height * 0.5
          + Math.sin(history * 2.4) * ctx.height * 0.16
          + Math.sin(history * 5.7 + i * 0.08) * ctx.height * 0.035
          + band * ctx.height * (0.07 + 0.015 * Math.sin(history * 3))
        p.vertex(left + i * slitWidth, y)
      }
      p.endShape()
    }

    for (let i = 0; i < SLITS; i++) {
      const history = t - (SLITS - i) * 0.045
      const center = ctx.height * 0.5 + Math.sin(history * 2.4) * ctx.height * 0.16
      const radius = ctx.height * (0.1 + 0.025 * Math.sin(history * 3.1))
      const color = p.color(i % 13 === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(i % 13 === 0 ? 190 : 72)
      p.stroke(color)
      p.strokeWeight(Math.max(1, slitWidth * 0.38))
      p.line(left + (i + 0.5) * slitWidth, center - radius, left + (i + 0.5) * slitWidth, center + radius)
    }
  }
}
