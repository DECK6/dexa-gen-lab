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
    const columns = 6
    const total = columns * columns
    const beatFrame = p.frameCount + 9
    const step = Math.floor(beatFrame / 18)
    const envelope = Math.sin(((beatFrame % 18) / 18) * Math.PI)
    const offset = ((ctx.seed % total) + total) % total
    const active = (offset + step * 13) % total
    const spacing = size * 0.105
    const left = ctx.width / 2 - spacing * 2.5
    const top = ctx.height / 2 - spacing * 2.5

    for (let i = 0; i < total; i++) {
      const x = left + (i % columns) * spacing
      const y = top + Math.floor(i / columns) * spacing
      p.noStroke()
      p.fill(i === active ? ctx.palette.signal : ctx.palette.dim)
      p.circle(x, y, size * (i === active ? 0.018 + envelope * 0.025 : 0.009))
      if (i === active) {
        const accent = p.color(ctx.palette.accent)
        accent.setAlpha(envelope * 220)
        p.noFill()
        p.stroke(accent)
        p.strokeWeight(size * 0.003)
        p.circle(x, y, size * (0.035 + envelope * 0.025))
      }
    }
  }
}
