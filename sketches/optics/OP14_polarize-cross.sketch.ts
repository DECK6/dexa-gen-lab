import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const CELLS = 13

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.strokeCap(p.SQUARE)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    const analyzer = t * 0.72
    const gap = ctx.width * 0.058
    const center = (CELLS - 1) / 2

    for (let row = 0; row < CELLS; row++) {
      for (let col = 0; col < CELLS; col++) {
        const dx = col - center
        const dy = row - center
        const polarizer = Math.atan2(dy, dx) * 0.5 + (row + col) * 0.075
        const transmission = Math.pow(Math.cos(polarizer - analyzer), 2)
        const color = p.color((row + col) % 17 === 0 ? ctx.palette.accent : ctx.palette.signal)
        color.setAlpha(22 + transmission * 225)
        p.stroke(color)
        p.strokeWeight(1 + transmission * 3.6)
        const x = ctx.width / 2 + dx * gap
        const y = ctx.height / 2 + dy * gap
        const length = gap * (0.22 + transmission * 0.48)
        p.line(x - Math.cos(polarizer) * length, y - Math.sin(polarizer) * length,
          x + Math.cos(polarizer) * length, y + Math.sin(polarizer) * length)
      }
    }

    p.push()
    p.translate(ctx.width / 2, ctx.height / 2)
    p.rotate(analyzer)
    p.noFill()
    p.stroke(ctx.palette.paper)
    p.strokeWeight(1.5)
    p.rectMode(p.CENTER)
    p.rect(0, 0, ctx.width * 0.72, ctx.height * 0.06)
    p.rotate(p.HALF_PI)
    p.stroke(ctx.palette.dim)
    p.rect(0, 0, ctx.width * 0.72, ctx.height * 0.04)
    p.pop()
  }
}
