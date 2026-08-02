import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MAX_DEPTH = 4
const KIDS = 4

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const cols: P5.Color[] = []
  let hot!: P5.Color
  let phase = 0

  const ring = (x: number, y: number, r: number, depth: number, key: number, t: number) => {
    p.stroke(depth === MAX_DEPTH && key % 29 === 0 ? hot : cols[depth]!)
    p.strokeWeight(Math.max(0.65, 1.9 - depth * 0.28))
    p.circle(x, y, r * 2)
    if (depth >= MAX_DEPTH) return
    const direction = depth % 2 === 0 ? 1 : -1
    const spin = phase + key * 0.37 + t * direction * (0.45 + depth * 0.18)
    for (let i = 0; i < KIDS; i++) {
      const a = spin + (i * p.TWO_PI) / KIDS
      ring(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92, r * 0.34, depth + 1, key * KIDS + i, t)
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    for (let depth = 0; depth <= MAX_DEPTH; depth++) {
      const c = p.color(depth === 0 ? pal.dim : pal.signal)
      c.setAlpha(175 - depth * 18)
      cols.push(c)
    }
    hot = p.color(pal.accent)
    hot.setAlpha(210)
    p.noFill()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(150)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    p.noFill()
    const t = p.frameCount * 0.009
    const root = Math.min(p.width, p.height) * (0.21 + 0.012 * Math.sin(t + phase))
    ring(p.width / 2, p.height / 2, root, 0, 1, t)
  }
}
