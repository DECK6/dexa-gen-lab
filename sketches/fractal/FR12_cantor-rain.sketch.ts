import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Interval {
  x: number
  w: number
}

const GENERATIONS = 7
const ROWS = 15

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const levels: Interval[][] = []
  let drift = 0

  const cut = (x: number, w: number, depth: number, out: Interval[]) => {
    if (depth === 0) {
      out.push({ x, w })
      return
    }
    cut(x, w / 3, depth - 1, out)
    cut(x + (w * 2) / 3, w / 3, depth - 1, out)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    drift = p.random(p.height / ROWS)
    for (let depth = 0; depth < GENERATIONS; depth++) {
      const row: Interval[] = []
      cut(0, 1, depth, row)
      levels.push(row)
    }
    p.strokeCap(p.SQUARE)
  }

  p.draw = () => {
    p.background(pal.bg)
    const gap = p.height / ROWS
    const fall = (drift + p.frameCount * 0.72) % gap
    const left = p.width * 0.07
    const span = p.width * 0.86
    const cyan = p.color(pal.signal)
    cyan.setAlpha(190)
    const hot = p.color(pal.accent)
    hot.setAlpha(210)
    const guide = p.color(pal.dim)
    guide.setAlpha(75)

    for (let row = -1; row < ROWS; row++) {
      const y = row * gap + fall
      const depth = ((row + 30) % GENERATIONS + GENERATIONS) % GENERATIONS
      p.stroke(guide)
      p.strokeWeight(1)
      p.line(left, y, left + span, y)
      p.stroke(depth === 0 ? hot : cyan)
      p.strokeWeight(Math.max(1.1, 5.2 - depth * 0.56))
      for (const interval of levels[depth]!) {
        p.line(left + interval.x * span, y, left + (interval.x + interval.w) * span, y)
      }
    }

    p.stroke(hot)
    p.strokeWeight(1)
    p.line(left - 9, fall, left - 2, fall)
  }
}
