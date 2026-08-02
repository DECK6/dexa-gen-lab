import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Strand { x: number[]; y: number[]; age: number }
const STRANDS = 32
const NODES = 64

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const strands: Strand[] = []

  const advance = (s: Strand) => {
    for (let i = 0; i < NODES; i++) {
      const x = s.x[i]
      s.x[i] = 1 - 1.7 * Math.abs(x) + 0.5 * s.y[i]
      s.y[i] = x
    }
    s.age++
  }

  const reset = (s: Strand, age = 0) => {
    s.age = 0
    const tilt = p.random(-0.025, 0.025)
    for (let i = 0; i < NODES; i++) {
      s.x[i] = -0.88 + 1.76 * i / (NODES - 1)
      s.y[i] = tilt * s.x[i]
    }
    for (let i = 0; i < age; i++) advance(s)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < STRANDS; i++) {
      const s = { x: Array<number>(NODES), y: Array<number>(NODES), age: 0 }
      reset(s, i % 16)
      strands.push(s)
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(48)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    const line = p.color(pal.signal)
    line.setAlpha(125)
    p.noFill()
    p.stroke(line)
    p.strokeWeight(1.15)
    const scale = Math.min(p.width, p.height) * 0.21
    const cx = p.width * 0.51
    const cy = p.height * 0.52
    for (let k = 0; k < strands.length; k++) {
      const s = strands[k]
      advance(s)
      let valid = true
      for (let i = 1; i < NODES; i++) {
        valid = valid && Number.isFinite(s.x[i]) && Math.abs(s.x[i]) < 2.5
        if (valid) p.line(cx + s.x[i - 1] * scale, cy + s.y[i - 1] * scale, cx + s.x[i] * scale, cy + s.y[i] * scale)
        if (s.x[i - 1] * s.x[i] < 0) {
          p.noStroke()
          p.fill(pal.accent)
          p.circle(cx + s.x[i] * scale, cy + s.y[i] * scale, 2.8)
          p.noFill()
          p.stroke(line)
        }
      }
      if (!valid || s.age > 21) reset(s, k % 16)
    }
  }
}
