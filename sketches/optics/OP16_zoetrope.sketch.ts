import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SLOTS = 16

export function sketch(p: P5, ctx: SketchCtx): void {
  const drawFigure = (pose: number, alpha: number): void => {
    const phase = pose / 8 * p.TWO_PI
    const color = p.color(ctx.palette.signal)
    color.setAlpha(alpha)
    p.stroke(color)
    p.strokeWeight(2)
    p.noFill()
    p.circle(0, -15, 7)
    p.line(0, -11, 0, 7)
    p.line(0, -5, Math.sin(phase) * 9, 1)
    p.line(0, -5, -Math.sin(phase) * 9, -1)
    p.line(0, 7, Math.sin(phase + 0.9) * 10, 17)
    p.line(0, 7, -Math.sin(phase + 0.9) * 10, 17)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.rectMode(p.CENTER)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    p.translate(ctx.width / 2, ctx.height / 2)
    const t = p.frameCount / 60
    const radius = ctx.width * 0.31
    const shutterAngle = t * 1.75

    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(2)
    p.circle(0, 0, radius * 2.22)
    p.circle(0, 0, radius * 1.46)

    for (let i = 0; i < SLOTS; i++) {
      const angle = i / SLOTS * p.TWO_PI + t * 0.24
      const delta = Math.atan2(Math.sin(angle - shutterAngle), Math.cos(angle - shutterAngle))
      const exposure = Math.exp(-delta * delta * 18)
      p.push()
      p.rotate(angle)
      p.translate(0, -radius * 0.79)
      p.rotate(-angle)
      drawFigure((i + Math.floor(p.frameCount / 6)) % 8, 42 + exposure * 213)
      p.pop()

      p.push()
      p.rotate(angle)
      const slit = p.color(exposure > 0.72 ? ctx.palette.accent : ctx.palette.dim)
      slit.setAlpha(80 + exposure * 170)
      p.noStroke()
      p.fill(slit)
      p.rect(0, -radius, 4, radius * 0.28)
      p.pop()
    }
  }
}
