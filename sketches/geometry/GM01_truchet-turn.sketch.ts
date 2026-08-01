import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 13

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const base: number[] = []
  const skew: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < COLS * COLS; i++) {
      base.push(p.floor(p.random(4)))
      skew.push(p.random(-0.4, 0.4))
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const s = p.width / COLS
    const t = p.frameCount * 0.014
    const mid = (COLS - 1) / 2

    // lattice registration marks
    const grid = p.color(pal.dim)
    grid.setAlpha(60)
    p.stroke(grid)
    p.strokeWeight(1)
    for (let i = 0; i <= COLS; i++) {
      p.line(i * s, 0, i * s, p.height)
      p.line(0, i * s, p.width, i * s)
    }

    p.noFill()
    for (let r = 0; r < COLS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c
        const d = p.dist(c, r, mid, mid)
        const w = p.sin(t - d * 0.52 + skew[i]!)
        const turn = base[i]! * p.HALF_PI + w * p.HALF_PI

        const hot = w > 0.9
        const arcCol = p.color(hot ? pal.accent : pal.signal)
        arcCol.setAlpha(hot ? 210 : 90 + w * 60)

        p.push()
        p.translate(c * s + s / 2, r * s + s / 2)
        p.rotate(turn)
        p.stroke(arcCol)
        p.strokeWeight(hot ? 1.8 : 1.2)
        p.arc(-s / 2, -s / 2, s, s, 0, p.HALF_PI)
        p.arc(s / 2, s / 2, s, s, p.PI, p.PI + p.HALF_PI)
        p.pop()
      }
    }
  }
}
