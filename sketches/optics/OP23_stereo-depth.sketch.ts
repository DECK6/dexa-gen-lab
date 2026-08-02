import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 15
const ROWS = 15

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    const gap = ctx.width * 0.052
    const span = gap * (COLS - 1)
    const left = (ctx.width - span) / 2
    const top = (ctx.height - span) / 2
    const signal = p.color(ctx.palette.signal)
    signal.setAlpha(205)
    const stereo = p.color(ctx.palette.accent)
    stereo.setAlpha(105)
    const link = p.color(ctx.palette.dim)
    link.setAlpha(120)

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = left + col * gap
        const y = top + row * gap
        const depth = (Math.sin(col * 0.72 + t * 1.35) + Math.cos(row * 0.61 - t * 0.93)) * 0.5
        const disparity = depth * ctx.width * 0.022 * (0.72 + 0.28 * Math.sin(t * 0.8))
        p.stroke(link)
        p.strokeWeight(1)
        p.line(x - disparity, y, x + disparity, y)
        p.noStroke()
        p.fill(signal)
        p.circle(x - disparity, y, 6 + depth * 1.4)
        p.fill(stereo)
        p.circle(x + disparity, y, 3.4)
      }
    }

    p.noFill()
    p.stroke(ctx.palette.paper)
    p.strokeWeight(1.5)
    p.circle(ctx.width / 2, ctx.height / 2, 34)
    p.line(ctx.width / 2 - 23, ctx.height / 2, ctx.width / 2 + 23, ctx.height / 2)
    p.line(ctx.width / 2, ctx.height / 2 - 23, ctx.width / 2, ctx.height / 2 + 23)
  }
}
