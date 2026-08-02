import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const POINTS = 121

export function sketch(p: P5, ctx: SketchCtx): void {
  let current = new Float32Array(POINTS)
  let previous = new Float32Array(POINTS)

  const addPulse = (center: number, amplitude: number): void => {
    for (let i = 1; i < POINTS - 1; i++) {
      const value = amplitude * Math.exp(-1 * ((i - center) / 6) ** 2)
      current[i] += value
      previous[i] += amplitude * Math.exp(-1 * ((i - center + 1.4) / 6) ** 2)
    }
  }

  const reset = (): void => {
    current = new Float32Array(POINTS)
    previous = new Float32Array(POINTS)
    addPulse(13, -Math.min(ctx.width, ctx.height) * 0.12)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    reset()
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const cycle = p.frameCount % 420
    if (cycle === 1) reset()
    if (cycle === 145) addPulse(9, Math.min(ctx.width, ctx.height) * 0.07)

    for (let step = 0; step < 2; step++) {
      const next = new Float32Array(POINTS)
      for (let i = 1; i < POINTS - 1; i++) {
        next[i] = (2 * current[i] - previous[i] + 0.62 * (current[i - 1] - 2 * current[i] + current[i + 1])) * 0.999
      }
      previous = current
      current = next
    }

    const left = ctx.width * 0.08
    const span = ctx.width * 0.84
    const mid = ctx.height * 0.5
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    p.line(left, mid, left + span, mid)
    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2.2)
    p.beginShape()
    for (let i = 0; i < POINTS; i++) p.vertex(left + span * i / (POINTS - 1), mid + current[i])
    p.endShape()

    p.stroke(ctx.palette.paper)
    p.strokeWeight(3)
    p.line(left, mid - 32, left, mid + 32)
    p.line(left + span, mid - 32, left + span, mid + 32)
    p.fill(ctx.palette.accent)
    p.noStroke()
    for (let i = 10; i < POINTS - 1; i += 10) p.circle(left + span * i / (POINTS - 1), mid + current[i], 4)
  }
}
