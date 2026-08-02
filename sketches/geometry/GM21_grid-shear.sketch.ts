import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const LINES = 23
const SAMPLES = 52

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const out = [0, 0]
  let phase = 0
  let lensX = 0
  let lensY = 0
  let radius = 0

  const warp = (x: number, y: number) => {
    const dx = x - lensX
    const dy = y - lensY
    const falloff = p.exp(-(dx * dx + dy * dy) / (radius * radius))
    out[0] = x + dy * falloff * 0.48
    out[1] = y + dx * falloff * 0.08
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    phase = p.random(p.TWO_PI)
    radius = p.width * 0.24
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.012 + phase
    lensX = p.width * (0.5 + 0.24 * p.sin(t * 0.83))
    lensY = p.height * (0.5 + 0.2 * p.sin(t * 0.61 + 1.4))
    const line = p.color(pal.signal)
    line.setAlpha(100)
    p.stroke(line)
    p.strokeWeight(1)

    for (let i = 0; i < LINES; i++) {
      const fixed = (i / (LINES - 1)) * p.width
      p.beginShape()
      for (let s = 0; s <= SAMPLES; s++) {
        warp(fixed, (s / SAMPLES) * p.height)
        p.vertex(out[0]!, out[1]!)
      }
      p.endShape()
      p.beginShape()
      for (let s = 0; s <= SAMPLES; s++) {
        warp((s / SAMPLES) * p.width, fixed)
        p.vertex(out[0]!, out[1]!)
      }
      p.endShape()
    }

    const lens = p.color(pal.accent)
    lens.setAlpha(145)
    p.stroke(lens)
    p.strokeWeight(1.4)
    p.circle(lensX, lensY, radius * 1.35)
    p.line(lensX - 6, lensY, lensX + 6, lensY)
    p.line(lensX, lensY - 6, lensX, lensY + 6)
  }
}
