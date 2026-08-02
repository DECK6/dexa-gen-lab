import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

function soliton(x: number, center: number, width: number): number {
  const cosh = Math.cosh((x - center) / width)
  return 1 / (cosh * cosh)
}

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const left = ctx.width * 0.08
    const span = ctx.width * 0.84
    const phase = (p.frameCount % 260) / 260
    const centerA = 0.04 + phase * 0.92
    const centerB = 0.96 - phase * 0.92
    const baseline = ctx.height * 0.56
    const amplitude = ctx.height * 0.18
    const component = p.color(ctx.palette.signal)
    component.setAlpha(55)

    p.stroke(ctx.palette.dim)
    p.line(left, baseline, left + span, baseline)
    p.noFill()
    p.stroke(component)
    p.strokeWeight(1)
    for (let pulse = 0; pulse < 2; pulse++) {
      p.beginShape()
      for (let step = 0; step <= 220; step++) {
        const x = step / 220
        const value = soliton(x, pulse === 0 ? centerA : centerB, pulse === 0 ? 0.045 : 0.062)
        p.vertex(left + x * span, baseline - value * amplitude * (pulse === 0 ? 1 : 0.76))
      }
      p.endShape()
    }

    p.stroke(ctx.palette.signal)
    p.strokeWeight(2.5)
    p.beginShape()
    for (let step = 0; step <= 220; step++) {
      const x = step / 220
      const combined = soliton(x, centerA, 0.045) + soliton(x, centerB, 0.062) * 0.76
      p.vertex(left + x * span, baseline - combined * amplitude)
    }
    p.endShape()
    p.fill(ctx.palette.accent)
    p.noStroke()
    p.circle(left + centerA * span, baseline, 7)
    p.circle(left + centerB * span, baseline, 7)
    p.fill(ctx.palette.paper)
    p.circle(left + span * 0.5, baseline, 3)
  }
}
