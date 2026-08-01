import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const VARIANT = 2

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const t = p.frameCount * 0.012
    const cols = 10 + VARIANT
    const rows = 8 + (VARIANT % 5)
    const margin = 42
    const cellW = (ctx.width - margin * 2) / cols
    const cellH = (ctx.height - margin * 2) / rows
    p.noStroke()
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const signal = (p.noise(x * 0.17, y * 0.21, t * 0.08) + Math.sin(t + x * 0.4 + y * 0.23) + 1) / 3
        const color = p.color(signal > 0.68 ? ctx.palette.accent : ctx.palette.signal)
        color.setAlpha(65 + signal * 170)
        p.fill(color)
        const h = Math.max(2, cellH * signal * (0.45 + (VARIANT % 4) * 0.12))
        p.rect(margin + x * cellW + 1, margin + (y + 1) * cellH - h, Math.max(2, cellW - 3), h)
      }
    }
    p.noFill()
    p.stroke(ctx.palette.paper)
    p.strokeWeight(2)
    p.beginShape()
    for (let x = margin; x <= ctx.width - margin; x += 6) {
      const y = ctx.height * 0.5 + Math.sin(x * (0.018 + VARIANT * 0.001) + t * 2) * (44 + VARIANT * 3)
      p.vertex(x, y)
    }
    p.endShape()
  }
}
