import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const GRID = 12

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    phase = p.random(p.TWO_PI)
  }

  p.draw = () => {
    p.background(pal.bg)
    const cell = p.width / GRID
    const travel = cell * 2
    const shift = (p.frameCount * 0.62) % travel
    const t = p.frameCount * 0.018 + phase

    for (let row = -3; row < GRID + 3; row++) {
      for (let col = -3; col < GRID + 3; col++) {
        const x = col * cell + shift
        const y = row * cell + shift
        const wave = 0.5 + 0.5 * p.sin(t + (col + row) * 0.58)
        const rx = cell * (0.36 + wave * 0.13)
        const ry = cell * (0.2 + wave * 0.18)
        const hot = (col - row + GRID * 8) % 11 === 0
        const line = p.color(hot ? pal.accent : pal.signal)
        line.setAlpha(hot ? 180 : 70 + wave * 100)
        p.stroke(line)
        p.strokeWeight(hot ? 1.45 : 1)
        p.quad(x, y - ry, x + rx, y, x, y + ry, x - rx, y)
      }
    }

    const rail = p.color(pal.dim)
    rail.setAlpha(110)
    p.stroke(rail)
    p.line(18, 18, 70, 18)
    p.line(18, 18, 18, 70)
  }
}
