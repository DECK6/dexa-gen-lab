import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const ridge = (x: number, horizon: number): number => horizon
    - ctx.height * (0.075 + Math.sin(x * 0.017) * 0.036 + Math.sin(x * 0.041 + 1.4) * 0.018)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    const horizon = ctx.height * 0.45

    p.noFill()
    p.stroke(ctx.palette.paper)
    p.strokeWeight(2)
    p.beginShape()
    for (let x = 0; x <= ctx.width; x += 6) p.vertex(x, ridge(x, horizon))
    p.endShape()

    for (let layer = 0; layer < 14; layer++) {
      const reflected = p.color(ctx.palette.signal)
      reflected.setAlpha(145 - layer * 7)
      p.stroke(reflected)
      p.strokeWeight(layer < 3 ? 2 : 1)
      p.beginShape()
      for (let x = 0; x <= ctx.width; x += 6) {
        const noiseShift = (p.noise(x * 0.012, layer * 0.16, t * 0.22) - 0.5) * (8 + layer * 1.7)
        const heatShift = Math.sin(x * 0.035 + layer * 0.8 + t * 3.2) * (2 + layer * 0.55)
        const y = horizon + (horizon - ridge(x, horizon)) * (0.8 + layer * 0.045) + layer * 7
        p.vertex(x + noiseShift + heatShift, y)
      }
      p.endShape()
    }

    const haze = p.color(ctx.palette.dim)
    haze.setAlpha(120)
    p.stroke(haze)
    for (let layer = 0; layer < 9; layer++) {
      const y = horizon - 45 + layer * 11
      p.beginShape()
      for (let x = 0; x <= ctx.width; x += 12) {
        p.vertex(x + Math.sin(x * 0.026 + t * 2.4 + layer) * 7, y)
      }
      p.endShape()
    }

    const sun = p.color(ctx.palette.accent)
    sun.setAlpha(210)
    p.noStroke()
    p.fill(sun)
    p.circle(ctx.width * 0.74, horizon - ctx.height * 0.1, 11)
  }
}
