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
    const t = p.frameCount * (0.008 + VARIANT * 0.0006)
    const count = 5 + (VARIANT % 5)
    const spacing = ctx.width / (count + 1)
    const centers: { x: number; y: number; pinX: number; pinY: number }[] = []
    for (let i = 0; i < count; i++) {
      const x = spacing * (i + 1)
      const y = ctx.height * 0.5 + Math.sin(i * 0.8 + VARIANT) * 72
      const radius = 26 + (i % 3) * 9 + VARIANT
      const angle = t * (i % 2 ? -1 : 1) * (1 + i * 0.08) + i
      p.noFill()
      p.stroke(i % 3 === 0 ? ctx.palette.accent : ctx.palette.signal)
      p.strokeWeight(2)
      p.circle(x, y, radius * 2)
      const teeth = 10 + (VARIANT % 4) * 2
      for (let tooth = 0; tooth < teeth; tooth++) {
        const a = angle + (tooth / teeth) * p.TWO_PI
        p.line(x + Math.cos(a) * radius, y + Math.sin(a) * radius, x + Math.cos(a) * (radius + 7), y + Math.sin(a) * (radius + 7))
      }
      const pinX = x + Math.cos(angle) * radius * 0.62
      const pinY = y + Math.sin(angle) * radius * 0.62
      p.fill(ctx.palette.paper)
      p.noStroke()
      p.circle(pinX, pinY, 7)
      centers.push({ x, y, pinX, pinY })
    }
    p.noFill()
    p.stroke(ctx.palette.paper)
    p.strokeWeight(2)
    p.beginShape()
    for (const center of centers) p.vertex(center.pinX, center.pinY)
    p.endShape()
  }
}
