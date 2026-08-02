import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MAX_DEPTH = 7
const STEPS = 5

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const cols: P5.Color[] = []
  let hot!: P5.Color
  let phase = 0

  const limb = (
    x: number,
    y: number,
    len: number,
    angle: number,
    depth: number,
    curl: number,
    hand: number,
    key: number,
  ) => {
    p.stroke(cols[depth]!)
    p.strokeWeight(Math.max(0.65, 3.2 - depth * 0.38))
    p.beginShape()
    p.vertex(x, y)
    let px = x
    let py = y
    for (let i = 1; i <= STEPS; i++) {
      const u = i / STEPS
      const a = angle + hand * curl * u * u
      px += Math.cos(a) * (len / STEPS)
      py += Math.sin(a) * (len / STEPS)
      p.vertex(px, py)
    }
    p.endShape()
    const endAngle = angle + hand * curl
    if (depth >= MAX_DEPTH) {
      if (key % 17 === 0) {
        p.stroke(hot)
        p.strokeWeight(2.5)
        p.point(px, py)
      }
      return
    }
    const pulse = Math.sin(p.frameCount * 0.009 + phase + depth * 0.7)
    limb(px, py, len * 0.71, endAngle + hand * (0.16 + depth * 0.018), depth + 1, curl * 0.9, hand, key * 2)
    limb(px, py, len * 0.57, endAngle - hand * (0.72 + pulse * 0.08), depth + 1, curl * 0.74, -hand, key * 2 + 1)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    for (let depth = 0; depth <= MAX_DEPTH; depth++) {
      const c = p.color(depth === 0 ? pal.dim : pal.signal)
      c.setAlpha(115 + depth * 15)
      cols.push(c)
    }
    hot = p.color(pal.accent)
    hot.setAlpha(220)
    p.noFill()
  }

  p.draw = () => {
    p.background(pal.bg)
    const curl = 0.38 + 0.17 * Math.sin(p.frameCount * 0.008 + phase)
    const spin = p.frameCount * 0.0018 + phase
    const len = Math.min(p.width, p.height) * 0.14
    for (let root = 0; root < 3; root++) {
      const angle = spin + (root * p.TWO_PI) / 3
      limb(p.width / 2, p.height / 2, len, angle, 0, curl, root % 2 === 0 ? 1 : -1, root + 1)
    }
  }
}
