import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MAX_DEPTH = 6 // recursion cap; MIN_R usually stops it around depth 5
const KIDS = 3
const MIN_R = 4.5

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  const nest = (x: number, y: number, r: number, depth: number, t: number) => {
    const c = p.color(depth >= 4 ? pal.accent : depth === 0 ? pal.dim : pal.signal)
    c.setAlpha(depth >= 4 ? 150 : 200 - depth * 22)
    p.stroke(c)
    p.strokeWeight(Math.max(0.6, 2.2 - depth * 0.35))
    p.circle(x, y, r * 2)

    if (depth >= MAX_DEPTH || r < MIN_R) return
    // Children sit internally tangent to the parent; k breathes per level.
    const k = 0.42 + 0.055 * Math.sin(t * 0.021 + depth * 0.75 + phase)
    const rc = r * k
    const d = r - rc
    const spin = t * 0.0038 * (depth % 2 === 0 ? 1 : -1) + depth * 0.9 + phase
    for (let i = 0; i < KIDS; i++) {
      const a = spin + (i * p.TWO_PI) / KIDS
      nest(x + Math.cos(a) * d, y + Math.sin(a) * d, rc, depth + 1, t)
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    p.noFill()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(64)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    p.noFill()

    const t = p.frameCount
    const breath = 1 + 0.035 * Math.sin(t * 0.012 + phase)
    nest(p.width / 2, p.height / 2, Math.min(p.width, p.height) * 0.44 * breath, 0, t)
  }
}
