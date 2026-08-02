import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

function sourceX(frame: number, width: number): number {
  const phase = ((frame + 200) % 720 + 720) % 720 / 720
  const sweep = phase < 0.5 ? phase * 2 : 2 - phase * 2
  return width * (0.12 + sweep * 0.76)
}

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const cy = ctx.height * 0.5
    const ripple = p.frameCount % 10
    p.noFill()
    for (let ring = 18; ring >= 0; ring--) {
      const age = ring * 10 + ripple
      const radius = age * Math.min(ctx.width, ctx.height) * 0.0039
      const alpha = Math.max(28, 205 - age * 0.72)
      const color = p.color(ring % 6 === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(alpha)
      p.stroke(color)
      p.strokeWeight(ring % 6 === 0 ? 2 : 1)
      p.ellipse(sourceX(p.frameCount - age, ctx.width), cy, radius * 2)
    }

    const sx = sourceX(p.frameCount, ctx.width)
    p.stroke(ctx.palette.dim)
    p.line(ctx.width * 0.08, cy, ctx.width * 0.92, cy)
    p.stroke(ctx.palette.paper)
    p.line(sx, cy - 18, sx, cy + 18)
    p.fill(ctx.palette.accent)
    p.noStroke()
    p.circle(sx, cy, 11)
    p.fill(ctx.palette.signal)
    p.circle(sx + 14, cy, 3)
  }
}
