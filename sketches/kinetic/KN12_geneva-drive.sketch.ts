import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const y = ctx.height * 0.5
    const driverX = ctx.width * 0.39
    const wheelX = ctx.width * 0.61
    const slots = 6
    const step = p.TWO_PI / slots
    const driverAngle = p.frameCount * 0.035
    const turns = Math.floor(driverAngle / p.TWO_PI)
    const phase = (driverAngle % p.TWO_PI) / p.TWO_PI
    const engaged = Math.min(1, phase / 0.24)
    const ease = engaged * engaged * (3 - 2 * engaged)
    const wheelAngle = -(turns + ease) * step
    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(2)
    p.circle(driverX, y, size * 0.2)
    p.circle(wheelX, y, size * 0.28)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(5)
    for (let i = 0; i < slots; i++) {
      const angle = wheelAngle + i * step
      p.line(
        wheelX + Math.cos(angle) * size * 0.035,
        y + Math.sin(angle) * size * 0.035,
        wheelX + Math.cos(angle) * size * 0.125,
        y + Math.sin(angle) * size * 0.125,
      )
    }
    p.strokeWeight(2)
    for (let i = 0; i < slots; i++) {
      const angle = wheelAngle + (i + 0.5) * step
      p.arc(wheelX, y, size * 0.19, size * 0.19, angle - step * 0.28, angle + step * 0.28)
    }
    const pinRadius = size * 0.085
    const pinX = driverX + Math.cos(driverAngle) * pinRadius
    const pinY = y + Math.sin(driverAngle) * pinRadius
    p.stroke(ctx.palette.paper)
    p.strokeWeight(3)
    p.line(driverX, y, pinX, pinY)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(pinX, pinY, 13)
    p.fill(ctx.palette.ink)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.circle(driverX, y, 15)
    p.circle(wheelX, y, 18)
    p.noStroke()
    p.fill(ctx.palette.paper)
    for (let i = 0; i < slots; i++) {
      const angle = wheelAngle + i * step
      p.circle(wheelX + Math.cos(angle) * size * 0.15, y + Math.sin(angle) * size * 0.15, 5)
    }
  }
}
