import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Strand { x: number[]; y: number[]; age: number }
const STRANDS = 34
const NODES = 62

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const strands: Strand[] = []

  const reset = (s: Strand, age = 0) => {
    s.age = 0
    for (let i = 0; i < NODES; i++) {
      s.x[i] = -1.05 + (2.1 * i) / (NODES - 1)
      s.y[i] = p.random(-0.035, 0.035)
    }
    for (let i = 0; i < age; i++) advance(s, 1.4)
  }

  const advance = (s: Strand, a: number) => {
    for (let i = 0; i < NODES; i++) {
      const x = s.x[i]
      const nx = 1 - a * x * x + s.y[i]
      s.y[i] = 0.3 * x
      s.x[i] = nx
    }
    s.age++
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < STRANDS; i++) {
      const s = { x: Array<number>(NODES), y: Array<number>(NODES), age: 0 }
      reset(s, i % 17)
      strands.push(s)
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(42)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    const fold = p.color(pal.signal)
    fold.setAlpha(105)
    p.noFill()
    p.stroke(fold)
    p.strokeWeight(1)
    const scale = Math.min(p.width, p.height) * 0.27
    const cx = p.width * 0.53
    const cy = p.height * 0.52
    for (let k = 0; k < strands.length; k++) {
      const s = strands[k]
      advance(s, 1.4 + 0.012 * Math.sin(p.frameCount * 0.004))
      p.beginShape()
      let valid = true
      for (let i = 0; i < NODES; i++) {
        valid = valid && Number.isFinite(s.x[i]) && Math.abs(s.x[i]) < 2
        if (valid) p.vertex(cx + s.x[i] * scale, cy + s.y[i] * scale)
      }
      p.endShape()
      if (!valid || s.age > 23) reset(s, k % 17)
    }
    const lead = strands[p.frameCount % strands.length]
    p.noStroke()
    p.fill(pal.accent)
    p.circle(cx + lead.x[NODES - 1] * scale, cy + lead.y[NODES - 1] * scale, 4.5)
  }
}
