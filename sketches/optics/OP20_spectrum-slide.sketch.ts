import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SEGMENTS = 52
const RIBBONS = 9

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    const stops = [
      p.color(ctx.palette.dim),
      p.color(ctx.palette.signal),
      p.color(ctx.palette.paper),
      p.color(ctx.palette.signal),
      p.color(ctx.palette.accent),
      p.color(ctx.palette.signal),
      p.color(ctx.palette.dim),
    ]
    const left = ctx.width * 0.08
    const span = ctx.width * 0.84
    const segmentWidth = span / SEGMENTS
    const gap = ctx.height * 0.078

    p.noStroke()
    for (let ribbon = 0; ribbon < RIBBONS; ribbon++) {
      const baseY = ctx.height * 0.19 + ribbon * gap
      for (let segment = 0; segment < SEGMENTS; segment++) {
        const phase = (segment / SEGMENTS + t * 0.1 + ribbon * 0.115) % 1
        const scaled = phase * (stops.length - 1)
        const index = Math.min(stops.length - 2, Math.floor(scaled))
        const color = p.lerpColor(stops[index], stops[index + 1], scaled - index)
        color.setAlpha(185)
        p.fill(color)
        const x0 = left + segment * segmentWidth
        const x1 = x0 + segmentWidth + 1
        const shear0 = (x0 - left) / span * ctx.height * 0.085
        const shear1 = (x1 - left) / span * ctx.height * 0.085
        const thickness = gap * (0.42 + 0.08 * Math.sin(t * 1.3 + ribbon))
        p.quad(x0, baseY + shear0, x1, baseY + shear1,
          x1, baseY + shear1 + thickness, x0, baseY + shear0 + thickness)
      }
    }

    p.noFill()
    p.stroke(ctx.palette.dim)
    p.rect(left, ctx.height * 0.13, span, ctx.height * 0.76)
  }
}
