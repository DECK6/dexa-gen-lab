import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  let omega = 2.2
  let radiusState = 0.28
  let radialVelocity = 0
  let spin = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    const dt = 1 / 60
    const drive = 3.25 + Math.sin(p.frameCount * 0.012) * 0.55
    const targetRadius = Math.min(0.9, Math.max(0.12, (omega - 1.1) / 2.7))
    radialVelocity += ((targetRadius - radiusState) * 8 - radialVelocity * 3.1) * dt
    radiusState += radialVelocity * dt
    omega += (drive - omega * 0.82 - radiusState * 1.45) * dt
    spin += omega * dt
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const cx = ctx.width * 0.5
    const pivotY = ctx.height * 0.22
    const armLength = size * 0.25
    const radius = size * (0.07 + radiusState * 0.12)
    const projected = Math.cos(spin) * radius
    const ballY = pivotY + Math.sqrt(Math.max(0, armLength * armLength - radius * radius))
    const sleeveY = pivotY + armLength * 1.45 - radius * 0.55
    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    p.ellipse(cx, ballY, radius * 2, radius * 0.45)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(3)
    p.line(cx, ctx.height * 0.12, cx, ctx.height * 0.83)
    for (const side of [-1, 1]) {
      const ballX = cx + projected * side
      p.line(cx, pivotY, ballX, ballY)
      p.line(ballX, ballY, cx, sleeveY)
      p.fill(side === 1 ? ctx.palette.accent : ctx.palette.signal)
      p.noStroke()
      p.circle(ballX, ballY, size * 0.045)
      p.noFill()
      p.stroke(ctx.palette.signal)
      p.strokeWeight(3)
    }
    p.fill(ctx.palette.ink)
    p.stroke(ctx.palette.paper)
    p.rectMode(p.CENTER)
    p.rect(cx, sleeveY, size * 0.11, size * 0.045, 4)
    p.noStroke()
    p.fill(ctx.palette.paper)
    for (let i = 0; i < 8; i++) {
      const y = ctx.height * 0.2 + i * size * 0.07
      p.rect(ctx.width * 0.82, y, size * 0.06 * (0.35 + omega / 4), 3)
    }
    p.fill(ctx.palette.accent)
    p.circle(ctx.width * 0.82 + size * 0.06 * radiusState, ctx.height * 0.76, 8)
  }
}
