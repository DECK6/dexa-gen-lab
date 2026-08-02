import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 17
const ROWS = 15

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const gapX = p.width / (COLS + 1)
    const gapY = p.height / (ROWS + 1)
    const cycle = (p.frameCount % 300) / 300
    const opening = cycle < 0.4 ? cycle / 0.4 : cycle < 0.75 ? 1 - (cycle - 0.4) / 0.35 : 0
    const repairing = cycle >= 0.4 && cycle < 0.75
    const centerX = p.width * 0.5 + Math.sin(p.frameCount * 0.011) * p.width * 0.12
    const centerY = p.height * 0.5 + Math.cos(p.frameCount * 0.009) * p.height * 0.08
    const radius = p.width * 0.19 * opening
    const node = (col: number, row: number) => ({
      x: (col + 1) * gapX + (row % 2) * gapX * 0.5,
      y: (row + 1) * gapY,
    })

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const from = node(col, row)
        const targets = [node(col + 1, row), node(col + (row % 2), row + 1)]
        for (const to of targets) {
          if (to.x > p.width || to.y > p.height) continue
          const midX = (from.x + to.x) / 2
          const midY = (from.y + to.y) / 2
          const distance = p.dist(midX, midY, centerX, centerY)
          if (distance < radius) continue
          const fresh = repairing && distance < radius + 28
          const thread = p.color(fresh ? ctx.palette.accent : ctx.palette.signal)
          thread.setAlpha(fresh ? 230 : 125)
          p.stroke(thread)
          p.strokeWeight(fresh ? 2.6 : 1.2)
          p.line(from.x, from.y, to.x, to.y)
        }
      }
    }

    p.noFill()
    const tear = p.color(ctx.palette.accent)
    tear.setAlpha(110 + opening * 100)
    p.stroke(tear)
    p.strokeWeight(1.5)
    if (radius > 2) p.circle(centerX, centerY, radius * 2)
    p.noStroke()
    p.fill(ctx.palette.paper)
    p.circle(centerX, centerY, 4)
  }
}
