import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const size = Math.min(ctx.width, ctx.height)
    const phase = (p.frameCount % 300) / 300
    const amount = 0.12 + 0.75 * (0.5 - 0.5 * Math.cos(phase * p.TWO_PI))
    const left = ctx.width / 2 - size * 0.32
    const right = ctx.width / 2 + size * 0.32
    const top = ctx.height / 2 - size * 0.3
    const bottom = ctx.height / 2 + size * 0.3
    const level = bottom - amount * (bottom - top)
    const time = p.frameCount * 0.025
    const liquid = p.color(ctx.palette.signal)
    liquid.setAlpha(42)

    p.noStroke()
    p.fill(liquid)
    p.beginShape()
    for (let step = 0; step <= 28; step++) {
      const x = p.lerp(left, right, step / 28)
      const y = level + Math.sin(step * 0.55 + time) * size * 0.008
      p.vertex(x, y)
    }
    p.vertex(right, bottom)
    p.vertex(left, bottom)
    p.endShape(p.CLOSE)

    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(size * 0.005)
    p.beginShape()
    for (let step = 0; step <= 28; step++) {
      const x = p.lerp(left, right, step / 28)
      p.vertex(x, level + Math.sin(step * 0.55 + time) * size * 0.008)
    }
    p.endShape()
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.rectMode(p.CENTER)
    p.rect(right + size * 0.035, level, size * 0.025, size * 0.009)
  }
}
