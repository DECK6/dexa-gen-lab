import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const angles: number[] = []
  const velocities: number[] = []
  let base = 0
  let baseVelocity = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 9; i++) {
      angles.push(p.random(-0.72, 0.72))
      velocities.push(p.random(-0.12, 0.12))
    }
  }

  p.draw = () => {
    for (let substep = 0; substep < 3; substep++) {
      const dt = 1 / 180
      const forcing = angles.reduce((sum, angle) => sum + Math.sin(angle), 0)
      const baseAcceleration = -1.8 * base - 0.48 * baseVelocity + forcing * 0.18
      for (let i = 0; i < angles.length; i++) {
        const angle = angles[i]!
        const velocity = velocities[i]!
        const escapement = 0.2 * (1 - (angle * angle) / 0.32) * velocity
        const acceleration = -5.4 * Math.sin(angle) + escapement - baseAcceleration * 1.9 * Math.cos(angle)
        velocities[i] = velocity + acceleration * dt
        angles[i] = angle + velocities[i]! * dt
      }
      baseVelocity += baseAcceleration * dt
      base += baseVelocity * dt
    }
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const shift = base * size * 0.08
    const platformY = ctx.height * 0.76
    p.stroke(ctx.palette.dim)
    p.strokeWeight(2)
    for (let i = 0; i < 8; i++) {
      const x = ctx.width * 0.14 + i * ctx.width * 0.105
      p.line(x, platformY + size * 0.045, x + Math.sin(p.frameCount * 0.02 + i) * 8, platformY + size * 0.09)
    }
    p.stroke(ctx.palette.signal)
    p.strokeWeight(7)
    p.line(ctx.width * 0.08 + shift, platformY, ctx.width * 0.92 + shift, platformY)
    for (let i = 0; i < angles.length; i++) {
      const x = ctx.width * (0.12 + i * 0.095) + shift
      const pivotY = platformY - size * 0.055
      const length = size * 0.18
      const angle = angles[i]!
      const bobX = x + Math.sin(angle) * length
      const bobY = pivotY - Math.cos(angle) * length
      p.noFill()
      p.stroke(ctx.palette.dim)
      p.strokeWeight(2)
      p.triangle(x - size * 0.035, platformY, x + size * 0.035, platformY, x, pivotY - size * 0.11)
      p.stroke(ctx.palette.signal)
      p.strokeWeight(3)
      p.line(x, pivotY, bobX, bobY)
      p.noStroke()
      p.fill(i === 0 ? ctx.palette.accent : ctx.palette.paper)
      p.circle(bobX, bobY, 10)
      p.fill(ctx.palette.signal)
      p.circle(x, pivotY, 6)
    }
  }
}
