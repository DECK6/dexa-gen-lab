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
    p.noFill()
    const t = p.frameCount * (0.008 + VARIANT * 0.0007)
    const layers = 10 + (VARIANT % 5) * 2
    for (let layer = 0; layer < layers; layer++) {
      const color = p.color(layer % 4 === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(80 + layer * 7)
      p.stroke(color)
      p.strokeWeight(layer % 5 === 0 ? 2 : 1)
      p.beginShape()
      for (let x = -20; x <= ctx.width + 20; x += 4) {
        const phase = x * (0.009 + VARIANT * 0.0011) + t * (1 + layer * 0.035)
        const envelope = Math.sin((x / ctx.width) * Math.PI)
        const y = ctx.height * (0.16 + (layer + 1) / (layers + 2) * 0.68)
          + Math.sin(phase + layer * 0.42) * (16 + VARIANT * 2.2) * envelope
          + Math.cos(phase * (1.4 + (VARIANT % 3) * 0.17) - t) * (5 + layer * 0.45)
        p.vertex(x, y)
      }
      p.endShape()
    }
    p.stroke(ctx.palette.paper)
    p.strokeWeight(1)
    const scan = (Math.sin(t * 0.7) * 0.5 + 0.5) * ctx.width
    p.line(scan, 32, scan, ctx.height - 32)
  }
}
