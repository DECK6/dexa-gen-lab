import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

function wrappedDistance(x: number, center: number): number {
  const distance = x - center
  return distance - Math.round(distance)
}

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const left = ctx.width * 0.07
    const span = ctx.width * 0.86
    const mid = ctx.height * 0.48
    const amplitude = ctx.height * 0.18
    const groupCenter = (0.15 + p.frameCount * 0.0017) % 1
    const phaseOffset = p.frameCount * 0.0048
    const envelopeAt = (x: number): number => Math.exp(-1 * (wrappedDistance(x, groupCenter) / 0.13) ** 2)

    p.noFill()
    const guide = p.color(ctx.palette.signal)
    guide.setAlpha(55)
    p.stroke(guide)
    p.strokeWeight(1)
    for (const direction of [-1, 1]) {
      p.beginShape()
      for (let step = 0; step <= 260; step++) {
        const x = step / 260
        p.vertex(left + x * span, mid + direction * envelopeAt(x) * amplitude)
      }
      p.endShape()
    }

    p.stroke(ctx.palette.signal)
    p.strokeWeight(2.3)
    p.beginShape()
    for (let step = 0; step <= 300; step++) {
      const x = step / 300
      const carrier = Math.sin(p.TWO_PI * 14 * (x - phaseOffset))
      p.vertex(left + x * span, mid + carrier * envelopeAt(x) * amplitude)
    }
    p.endShape()

    const groupX = left + groupCenter * span
    const phaseX = left + ((0.15 + phaseOffset) % 1) * span
    p.stroke(ctx.palette.dim)
    p.line(left, ctx.height * 0.78, left + span, ctx.height * 0.78)
    p.stroke(ctx.palette.accent)
    p.line(groupX, mid - amplitude - 18, groupX, mid + amplitude + 18)
    p.fill(ctx.palette.accent)
    p.noStroke()
    p.circle(groupX, ctx.height * 0.78, 9)
    p.fill(ctx.palette.signal)
    p.circle(phaseX, ctx.height * 0.78, 6)
    p.fill(ctx.palette.paper)
    p.circle(left, ctx.height * 0.78, 3)
  }
}
