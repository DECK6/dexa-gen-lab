import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const LINES = 21

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const coords: number[] = []
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    phase = p.random(p.TWO_PI)
    for (let i = 0; i < LINES; i++) coords.push(0)
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.018 + phase
    const center = p.width / 2
    const cell = p.width / (LINES + 2)
    const middle = (LINES - 1) / 2
    const breath = p.sin(t)

    for (let i = 0; i < LINES; i++) {
      const d = i - middle
      const influence = p.exp(-p.abs(d) * 0.11)
      const ripple = p.sin(t * 1.3 - p.abs(d) * 0.5) * 0.035
      coords[i] = center + d * cell * (1 + breath * influence * 0.16 + ripple)
    }

    for (let i = 0; i < LINES; i++) {
      const hot = p.abs(i - middle) === 3
      const line = p.color(hot ? pal.accent : pal.signal)
      line.setAlpha(hot ? 125 : 58)
      p.stroke(line)
      p.strokeWeight(hot ? 1.4 : 1)
      p.line(coords[i]!, 0, coords[i]!, p.height)
      p.line(0, coords[i]!, p.width, coords[i]!)
    }

    const nodes = p.color(pal.paper)
    nodes.setAlpha(105)
    p.stroke(nodes)
    p.strokeWeight(1.8)
    for (let row = 0; row < LINES; row += 2) {
      for (let col = 0; col < LINES; col += 2) p.point(coords[col]!, coords[row]!)
    }

    const mark = p.color(pal.accent)
    mark.setAlpha(210)
    p.stroke(mark)
    p.strokeWeight(2.8)
    p.point(center, center)
  }
}
