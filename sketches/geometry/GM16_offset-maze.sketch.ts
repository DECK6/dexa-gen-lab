import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const ROWS = 15
const COLS = 13

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const offsets: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    for (let row = 0; row < ROWS; row++) offsets.push(p.random(-1, 1))
  }

  p.draw = () => {
    p.background(pal.bg)
    const cell = p.width / COLS
    const lane = p.height / ROWS
    const t = p.frameCount * 0.017

    for (let row = 0; row < ROWS; row++) {
      const direction = row % 2 === 0 ? 1 : -1
      const shift = p.sin(t + row * 0.48 + offsets[row]!) * cell * 0.78
      const y = (row + 0.5) * lane
      for (let col = -2; col < COLS + 2; col++) {
        const x = (col + 0.5) * cell + shift
        const turn = (col + row * 3) % 4
        const hot = (col - row + COLS * 4) % 17 === 0
        const line = p.color(hot ? pal.accent : pal.signal)
        line.setAlpha(hot ? 205 : 95)
        p.stroke(line)
        p.strokeWeight(hot ? 1.65 : 1.1)
        p.line(x - cell * 0.42, y, x + cell * 0.42, y)
        const side = turn < 2 ? -1 : 1
        const vx = x + direction * side * cell * 0.42
        p.line(vx, y, vx, y + side * lane * 0.42)
      }
    }

    const frame = p.color(pal.dim)
    frame.setAlpha(105)
    p.stroke(frame)
    p.strokeWeight(1)
    p.rect(18, 18, p.width - 36, p.height - 36)
  }
}
