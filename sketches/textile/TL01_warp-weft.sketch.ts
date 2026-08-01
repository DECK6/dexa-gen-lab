import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const VARIANT = 1

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const t = p.frameCount * 0.01
    const gap = 12 + (VARIANT % 5) * 3
    p.noFill()
    for (let x = -gap; x <= ctx.width + gap; x += gap) {
      const color = p.color((Math.floor(x / gap) + VARIANT) % 5 === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(95)
      p.stroke(color)
      p.strokeWeight((Math.floor(x / gap) + VARIANT) % 4 === 0 ? 3 : 1)
      p.beginShape()
      for (let y = -20; y <= ctx.height + 20; y += 8) {
        p.vertex(x + Math.sin(y * 0.025 + t + x * 0.01) * (5 + VARIANT), y)
      }
      p.endShape()
    }
    for (let y = -gap; y <= ctx.height + gap; y += gap) {
      const color = p.color((Math.floor(y / gap) + VARIANT) % 6 === 0 ? ctx.palette.paper : ctx.palette.dim)
      color.setAlpha(120)
      p.stroke(color)
      p.strokeWeight((Math.floor(y / gap) + VARIANT) % 3 === 0 ? 2 : 1)
      p.beginShape()
      for (let x = -20; x <= ctx.width + 20; x += 8) {
        p.vertex(x, y + Math.cos(x * 0.022 - t * 1.2 + y * 0.012) * (4 + VARIANT * 0.7))
      }
      p.endShape()
    }
  }
}
