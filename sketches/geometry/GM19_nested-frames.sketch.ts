import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const FRAMES = 30

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.rectMode(p.CENTER)
    p.noFill()
    phase = p.random(1)
  }

  p.draw = () => {
    p.background(pal.bg)
    p.translate(p.width / 2, p.height / 2)
    const t = p.frameCount * 0.012
    const minSide = p.width * 0.035
    const ratio = (p.width * 0.92) / minSide

    for (let i = 0; i < FRAMES; i++) {
      const depth = (i / FRAMES + t * 0.14 + phase) % 1
      const side = minSide * p.pow(ratio, depth)
      const hot = i % 11 === 0
      const line = p.color(hot ? pal.accent : pal.signal)
      line.setAlpha(hot ? 190 : 45 + (1 - depth) * 125)
      p.stroke(line)
      p.strokeWeight(hot ? 1.7 : 1 + (1 - depth) * 0.45)
      p.push()
      p.rotate(t * 0.22 + depth * 0.7 + p.sin(t + depth * p.TWO_PI) * 0.08)
      p.rect(0, 0, side, side)
      p.pop()
    }

    const center = p.color(pal.paper)
    center.setAlpha(190)
    p.stroke(center)
    p.strokeWeight(2.5)
    p.point(0, 0)
  }
}
