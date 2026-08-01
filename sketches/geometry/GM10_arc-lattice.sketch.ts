import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const GRID = 4
const RINGS = 13
const GAP = 9

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const bias: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    for (let i = 0; i < GRID * GRID; i++) bias.push(p.random(p.TWO_PI))
  }

  // one layer of concentric arc stacks; the offset between layers makes the moire
  const layer = (dx: number, dy: number, sweepBase: number, col: P5.Color) => {
    const cell = p.width / GRID
    p.stroke(col)
    p.strokeWeight(1)
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const i = r * GRID + c
        const cx = cell * (c + 0.5) + dx
        const cy = cell * (r + 0.5) + dy
        const start = bias[i]! + sweepBase * (i % 3 === 0 ? -1 : 1)
        const sweep = p.PI * (0.75 + 0.5 * p.sin(sweepBase * 1.7 + bias[i]!))
        for (let k = 1; k <= RINGS; k++) {
          const dm = k * GAP * 2
          p.arc(cx, cy, dm, dm, start + k * 0.045, start + sweep + k * 0.045)
        }
      }
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.01
    const drift = p.width / GRID / 2

    const a = p.color(pal.signal)
    a.setAlpha(70)
    layer(0, 0, t, a)

    const b = p.color(pal.signal)
    b.setAlpha(60)
    layer(p.sin(t * 0.7) * drift, p.cos(t * 0.53) * drift * 0.6, -t * 0.8, b)

    const c = p.color(pal.accent)
    c.setAlpha(45)
    layer(p.sin(t * 0.31 + 1.7) * drift * 0.7, p.sin(t * 0.44) * drift * 0.5, t * 0.45, c)

    // registration crosshairs on the base lattice
    const mark = p.color(pal.dim)
    mark.setAlpha(120)
    p.stroke(mark)
    const cell = p.width / GRID
    for (let r = 0; r < GRID; r++) {
      for (let cIdx = 0; cIdx < GRID; cIdx++) {
        const cx = cell * (cIdx + 0.5)
        const cy = cell * (r + 0.5)
        p.line(cx - 4, cy, cx + 4, cy)
        p.line(cx, cy - 4, cx, cy + 4)
      }
    }
  }
}
