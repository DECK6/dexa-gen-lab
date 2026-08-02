import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const angles: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 12; i++) angles.push(p.random(p.TWO_PI))
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const time = p.frameCount * 0.006
    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    for (let i = 0; i < 9; i++) {
      const y = ctx.height * (0.16 + i * 0.085)
      const drift = p.noise(i * 0.27, time) * size * 0.12
      p.bezier(-30, y, ctx.width * 0.3, y - drift, ctx.width * 0.7, y + drift, ctx.width + 30, y)
    }
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const index = row * 4 + col
        const scale = 0.65 + row * 0.19
        const x = ctx.width * (0.15 + col * 0.235) + (row % 2) * size * 0.025
        const hubY = ctx.height * (0.3 + row * 0.23)
        const mast = size * 0.15 * scale
        const blade = size * 0.075 * scale
        const wind = 0.018 + p.noise(col * 0.31, row * 0.43, time) * 0.055
        angles[index] = angles[index]! + wind
        p.stroke(ctx.palette.signal)
        p.strokeWeight(3)
        p.line(x, hubY, x - blade * 0.35, hubY + mast)
        p.line(x, hubY, x + blade * 0.35, hubY + mast)
        for (let arm = 0; arm < 4; arm++) {
          const angle = angles[index]! + arm * p.HALF_PI
          const tipX = x + Math.cos(angle) * blade
          const tipY = hubY + Math.sin(angle) * blade
          p.line(x, hubY, tipX, tipY)
          p.line(tipX, tipY, x + Math.cos(angle + 0.36) * blade * 0.55, hubY + Math.sin(angle + 0.36) * blade * 0.55)
        }
        p.noStroke()
        p.fill(index % 5 === 0 ? ctx.palette.accent : ctx.palette.paper)
        p.circle(x, hubY, 8 * scale)
      }
    }
  }
}
