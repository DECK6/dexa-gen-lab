import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 12
const ROWS = 15

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.strokeJoin(p.MITER)
    p.noFill()
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    p.noFill()
    const cellW = p.width / COLS
    const cellH = p.height / ROWS
    const flow = (p.frameCount * 0.34) % (cellH * 2)
    const guide = p.color(ctx.palette.dim)
    guide.setAlpha(45)
    p.stroke(guide)
    p.strokeWeight(1)
    for (let x = 0; x <= p.width; x += cellW) p.line(x, 0, x, p.height)

    for (let row = -3; row < ROWS + 2; row++) {
      const baseY = row * cellH + flow
      for (let strand = 0; strand < 4; strand++) {
        const thread = p.color((row + strand) % 11 === 0 ? ctx.palette.accent : ctx.palette.signal)
        thread.setAlpha(strand === 1 ? 220 : 115)
        p.stroke(thread)
        p.strokeWeight(strand === 1 ? 2.2 : 1)
        p.beginShape()
        for (let col = -1; col <= COLS + 1; col++) {
          const peak = (col + row) % 2 === 0 ? 0 : cellH * 0.72
          const reverse = row % 2 === 0 ? peak : cellH * 0.72 - peak
          p.vertex(col * cellW, baseY + reverse + strand * 2.4)
        }
        p.endShape()
      }
    }

    p.noStroke()
    p.fill(ctx.palette.accent)
    for (let col = 1; col < COLS; col += 4) {
      const y = (col % 2) * cellH * 0.72 + flow
      for (let row = -2; row < ROWS; row += 6) p.circle(col * cellW, y + row * cellH, 4)
    }
  }
}
