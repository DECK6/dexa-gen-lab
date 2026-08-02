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
    const time = p.frameCount * 0.012
    const top = ctx.height / 2 - size * 0.34
    const height = size * 0.68

    p.noStroke()
    for (let veil = 0; veil < 7; veil++) {
      const color = p.color(veil === 5 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(veil === 5 ? 15 : 22)
      p.fill(color)
      const center = ctx.width / 2 + (veil - 3) * size * 0.06 + Math.sin(time + veil * 0.9) * size * 0.09
      const width = size * (0.09 + (veil % 3) * 0.018)
      p.beginShape()
      for (let step = 0; step <= 24; step++) {
        const y = top + (step / 24) * height
        const bend = Math.sin(step * 0.3 + time * 1.2 + veil) * size * 0.025
        p.vertex(center - width / 2 + bend, y)
      }
      for (let step = 24; step >= 0; step--) {
        const y = top + (step / 24) * height
        const bend = Math.sin(step * 0.3 + time * 1.2 + veil) * size * 0.025
        p.vertex(center + width / 2 + bend, y)
      }
      p.endShape(p.CLOSE)
    }
  }
}
