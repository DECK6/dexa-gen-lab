import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MAX_LINKS = 94

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const cycle = (p.frameCount % 240) / 240
    const growth = 0.45 + 0.55 * (0.5 - 0.5 * Math.cos(cycle * p.TWO_PI))
    const links = Math.floor(MAX_LINKS * growth)
    const rotation = p.frameCount * 0.0025
    let previousX = p.width / 2
    let previousY = p.height / 2

    for (let i = 0; i < links; i++) {
      const angle = i * 0.48 + rotation
      const radius = 7 + i * 2.65
      const x = p.width / 2 + Math.cos(angle) * radius
      const y = p.height / 2 + Math.sin(angle) * radius
      const chain = p.color(ctx.palette.dim)
      chain.setAlpha(130)
      p.stroke(chain)
      p.strokeWeight(2)
      p.line(previousX, previousY, x, y)

      const loop = p.color(i === links - 1 ? ctx.palette.accent : ctx.palette.signal)
      loop.setAlpha(i === links - 1 ? 245 : 120 + (i % 3) * 40)
      p.stroke(loop)
      p.strokeWeight(i % 4 === 0 ? 2.4 : 1.5)
      p.push()
      p.translate(x, y)
      p.rotate(angle + p.HALF_PI)
      p.ellipse(0, 0, 17, 8)
      p.pop()
      previousX = x
      previousY = y
    }

    const hookAngle = links * 0.48 + rotation
    p.stroke(ctx.palette.accent)
    p.strokeWeight(3)
    p.arc(previousX + Math.cos(hookAngle) * 15, previousY + Math.sin(hookAngle) * 15, 28, 28, hookAngle, hookAngle + p.PI)
  }
}
