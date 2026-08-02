import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Point = [number, number]

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    const lensX = ctx.width * (0.5 + 0.27 * Math.sin(t * 0.72))
    const lensY = ctx.height * (0.5 + 0.23 * Math.cos(t * 0.57))
    const radius = ctx.width * 0.18
    const bend = (x: number, y: number): Point => {
      const dx = x - lensX
      const dy = y - lensY
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance >= radius) return [x, y]
      const factor = 1 + 0.72 * (1 - distance * distance / (radius * radius))
      return [lensX + dx * factor, lensY + dy * factor]
    }
    const grid = p.color(ctx.palette.signal)
    grid.setAlpha(125)
    p.noFill()
    p.stroke(grid)
    p.strokeWeight(1)

    for (let x = ctx.width * 0.08; x <= ctx.width * 0.92; x += ctx.width * 0.062) {
      p.beginShape()
      for (let y = ctx.height * 0.08; y <= ctx.height * 0.92; y += 6) {
        const [px, py] = bend(x, y)
        p.vertex(px, py)
      }
      p.endShape()
    }
    for (let y = ctx.height * 0.08; y <= ctx.height * 0.92; y += ctx.height * 0.062) {
      p.beginShape()
      for (let x = ctx.width * 0.08; x <= ctx.width * 0.92; x += 6) {
        const [px, py] = bend(x, y)
        p.vertex(px, py)
      }
      p.endShape()
    }

    p.stroke(ctx.palette.paper)
    p.strokeWeight(2)
    p.circle(lensX, lensY, radius * 2)
    p.stroke(ctx.palette.accent)
    p.line(lensX - 12, lensY, lensX + 12, lensY)
    p.line(lensX, lensY - 12, lensX, lensY + 12)
  }
}
