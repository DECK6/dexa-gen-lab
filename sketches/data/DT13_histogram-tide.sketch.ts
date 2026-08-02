import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const count = 42

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.014
    const margin = 42
    const baseline = ctx.height - 70
    const width = ctx.width - margin * 2
    const mu1 = -0.38 + Math.sin(t) * 0.19
    const mu2 = 0.42 + Math.sin(t * 0.63 + 2) * 0.17
    const bins: number[] = []
    for (let i = 0; i < count; i++) {
      const x = p.map(i, 0, count - 1, -1, 1)
      const left = Math.exp(-((x - mu1) ** 2) / (0.055 + Math.sin(t * 0.7) * 0.012))
      const right = Math.exp(-((x - mu2) ** 2) / (0.105 + Math.cos(t * 0.8) * 0.018)) * 0.72
      bins.push(left + right + 0.035 + Math.sin(i * 1.7 + t * 2) * 0.018)
    }
    const peak = Math.max(...bins)
    const grid = p.color(pal.dim)
    grid.setAlpha(65)
    p.stroke(grid)
    p.strokeWeight(1)
    for (let y = baseline; y > 90; y -= 80) p.line(margin, y, ctx.width - margin, y)
    p.noStroke()
    for (let i = 0; i < count; i++) {
      const h = bins[i] / peak * (ctx.height - 170)
      const bar = p.color(i > count * 0.78 && bins[i] > peak * 0.35 ? pal.accent : pal.signal)
      bar.setAlpha(80 + bins[i] / peak * 135)
      p.fill(bar)
      p.rect(margin + i * width / count + 1, baseline - h, width / count - 2, h)
    }
    p.noFill()
    p.stroke(pal.paper)
    p.strokeWeight(2)
    p.beginShape()
    for (let i = 0; i < count; i++) {
      const h = bins[i] / peak * (ctx.height - 170)
      p.vertex(margin + (i + 0.5) * width / count, baseline - h)
    }
    p.endShape()
    p.stroke(pal.signal)
    p.strokeWeight(2)
    p.line(margin, baseline, ctx.width - margin, baseline)
  }
}
