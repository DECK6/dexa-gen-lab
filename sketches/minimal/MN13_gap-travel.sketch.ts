import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.strokeCap(p.SQUARE)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const size = Math.min(ctx.width, ctx.height)
    const count = 17
    const seedOffset = ((ctx.seed % count) + count) % count
    const gap = (p.frameCount / 20 + seedOffset) % count
    const left = ctx.width / 2 - size * 0.32
    const spacing = (size * 0.64) / (count - 1)
    const centerY = ctx.height / 2

    p.stroke(ctx.palette.signal)
    p.strokeWeight(size * 0.006)
    for (let i = 0; i < count; i++) {
      const rawDistance = Math.abs(i - gap)
      const distance = Math.min(rawDistance, count - rawDistance)
      const length = size * 0.3 * Math.min(1, distance)
      const x = left + i * spacing
      p.line(x, centerY - length / 2, x, centerY + length / 2)
    }

    const markerX = left + Math.min(gap, count - 1) * spacing
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(markerX, centerY + size * 0.2, size * 0.012)
  }
}
