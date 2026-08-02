import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SAMPLES = 560
const ADVANCE = 4

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const values = new Array<number>(SAMPLES)
  let x = 0.08

  const step = () => {
    x = (x + 0.19 * x ** 1.72) % 1
    return x
  }

  const reset = () => {
    x = p.random(0.025, 0.14)
    for (let i = 0; i < SAMPLES; i++) values[i] = step()
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    reset()
  }

  p.draw = () => {
    p.background(pal.bg)
    for (let i = 0; i < ADVANCE; i++) {
      values.shift()
      values.push(step())
    }
    const left = p.width * 0.06
    const top = p.height * 0.13
    const width = p.width * 0.88
    const height = p.height * 0.68
    const grid = p.color(pal.dim)
    grid.setAlpha(95)
    p.stroke(grid)
    p.strokeWeight(1)
    for (let i = 0; i <= 4; i++) p.line(left, top + height * i / 4, left + width, top + height * i / 4)
    const trace = p.color(pal.signal)
    trace.setAlpha(225)
    p.stroke(trace)
    p.strokeWeight(1.45)
    p.noFill()
    p.beginShape()
    for (let i = 0; i < SAMPLES; i++) p.vertex(left + width * i / (SAMPLES - 1), top + height * (1 - values[i]))
    p.endShape()
    const burst = p.color(pal.accent)
    burst.setAlpha(220)
    p.stroke(burst)
    p.strokeWeight(2.2)
    for (let i = 1; i < SAMPLES; i++) {
      if (values[i] > 0.72) {
        const x1 = left + width * (i - 1) / (SAMPLES - 1)
        const x2 = left + width * i / (SAMPLES - 1)
        p.line(x1, top + height * (1 - values[i - 1]), x2, top + height * (1 - values[i]))
      }
    }
    p.noStroke()
    p.fill(x > 0.72 ? pal.accent : pal.signal)
    p.rect(left, p.height * 0.87, width * x, 5)
    if (p.frameCount % 1500 === 0) reset()
  }
}
