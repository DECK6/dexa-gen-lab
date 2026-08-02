import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const RINGS = 19
const SPOKES = 30

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(pal.bg)
    const cx = p.width / 2
    const cy = p.height / 2
    const maxR = Math.min(p.width, p.height) * 0.46
    const t = p.frameCount * 0.014 + phase
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    const dim = p.color(pal.dim)

    for (let ring = 0; ring < RINGS; ring++) {
      const u = (ring + 1) / RINGS
      const radius = maxR * u * (0.94 + Math.sin(t * 0.7 - u * 4) * 0.06)
      const bloom = Math.sin(t - u * 5.2) * (1 - u) * 1.15 + t * 0.08
      const length = 5 + (1 - u) * 10
      for (let spoke = 0; spoke < SPOKES; spoke++) {
        const a = spoke / SPOKES * p.TWO_PI + ring * 0.045
        const x = cx + Math.cos(a) * radius
        const y = cy + Math.sin(a) * radius
        const direction = a + bloom
        const ex = x + Math.cos(direction) * length
        const ey = y + Math.sin(direction) * length
        const hot = spoke === 0 && ring % 2 === 0
        const col = hot ? orange : cyan
        col.setAlpha(hot ? 220 : 70 + (1 - u) * 90)
        p.stroke(col)
        p.strokeWeight(hot ? 1.7 : 0.9)
        p.line(x, y, ex, ey)
        const wing = 2.4 + (1 - u) * 1.8
        p.line(ex, ey, ex - Math.cos(direction - 0.55) * wing, ey - Math.sin(direction - 0.55) * wing)
        p.line(ex, ey, ex - Math.cos(direction + 0.55) * wing, ey - Math.sin(direction + 0.55) * wing)
      }
    }

    dim.setAlpha(130)
    p.noFill()
    p.stroke(dim)
    p.strokeWeight(1)
    p.circle(cx, cy, 14 + Math.sin(t) * 3)
  }
}
