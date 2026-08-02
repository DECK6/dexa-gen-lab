import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const ZONES = 24

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    p.translate(ctx.width / 2, ctx.height / 2)
    const t = p.frameCount / 60
    const wavelength = ctx.width * 0.012
    const focus = ctx.width * (0.2 + 0.045 * Math.sin(t * 1.25))

    p.noStroke()
    for (let zone = ZONES; zone >= 1; zone--) {
      const radius = Math.sqrt(zone * wavelength * focus + zone * zone * wavelength * wavelength * 0.25) * 1.28
      const color = p.color(zone % 2 === 0 ? ctx.palette.signal : ctx.palette.ink)
      color.setAlpha(zone % 2 === 0 ? 72 + 35 * Math.sin(t * 1.7 + zone * 0.18) : 255)
      p.fill(color)
      p.circle(0, 0, radius * 2)
    }

    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    p.circle(0, 0, ctx.width * 0.78)
    p.line(-ctx.width * 0.43, 0, ctx.width * 0.43, 0)
    p.line(0, -ctx.height * 0.43, 0, ctx.height * 0.43)

    const marker = p.color(ctx.palette.accent)
    marker.setAlpha(220)
    p.stroke(marker)
    p.strokeWeight(2)
    const focalMark = ctx.width * (0.31 + 0.025 * Math.sin(t * 1.25))
    p.line(focalMark, -9, focalMark, 9)
    p.line(focalMark - 5, -5, focalMark + 5, 5)
    p.line(focalMark - 5, 5, focalMark + 5, -5)
  }
}
