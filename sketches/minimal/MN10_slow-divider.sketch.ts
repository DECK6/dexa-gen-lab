import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const VARIANT = 10

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const t = p.frameCount * (0.006 + VARIANT * 0.0008)
    const cx = ctx.width / 2
    const cy = ctx.height / 2
    p.noFill()
    p.strokeWeight(2 + (VARIANT % 3))
    for (let i = 0; i < 6 + VARIANT; i++) {
      const phase = t + i * (0.46 + VARIANT * 0.025)
      const radius = 38 + i * (17 + VARIANT)
      p.stroke(i % 4 === 0 ? ctx.palette.accent : i % 2 === 0 ? ctx.palette.signal : ctx.palette.paper)
      if (VARIANT % 3 === 0) {
        p.circle(cx + Math.cos(phase) * radius * 0.35, cy + Math.sin(phase * 0.7) * radius * 0.28, radius)
      } else if (VARIANT % 3 === 1) {
        p.line(cx - radius, cy + Math.sin(phase) * radius * 0.4, cx + radius, cy - Math.sin(phase) * radius * 0.4)
      } else {
        p.push()
        p.translate(cx, cy)
        p.rotate(phase * 0.4)
        p.rectMode(p.CENTER)
        p.rect(Math.cos(phase) * 42, Math.sin(phase) * 42, radius, radius * 0.32)
        p.pop()
      }
    }
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(cx + Math.cos(t * 1.7) * 130, cy + Math.sin(t * 1.3) * 130, 10 + VARIANT)
  }
}
