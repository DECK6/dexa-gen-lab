import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const RINGS = 10

interface Dial {
  period: number
  phase: number
  sweep: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const dials: Dial[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    for (let i = 0; i < RINGS; i++) {
      dials.push({ period: 90 + i * 29 + p.random(-7, 7), phase: p.random(p.TWO_PI), sweep: p.random(0.32, 0.68) })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    p.translate(p.width / 2, p.height / 2)
    const maxR = p.min(p.width, p.height) * 0.43

    const track = p.color(pal.dim)
    track.setAlpha(70)
    p.stroke(track)
    p.strokeWeight(1)
    for (let i = 0; i < RINGS; i++) p.circle(0, 0, (maxR * (i + 1) * 2) / RINGS)

    for (let i = 0; i < RINGS; i++) {
      const dial = dials[i]!
      const direction = i % 2 === 0 ? 1 : -1
      const angle = dial.phase + direction * (p.frameCount / dial.period) * p.TWO_PI
      const sweep = p.PI * (dial.sweep + 0.12 * p.sin(angle * 1.7 + i))
      const radius = (maxR * (i + 1)) / RINGS
      const hot = i === 2 || i === 7
      const line = p.color(hot ? pal.accent : pal.signal)
      line.setAlpha(hot ? 205 : 135)
      p.stroke(line)
      p.strokeWeight(hot ? 2.2 : 1.4)
      p.arc(0, 0, radius * 2, radius * 2, angle, angle + sweep)
      p.strokeWeight(hot ? 3.4 : 2.5)
      p.point(p.cos(angle + sweep) * radius, p.sin(angle + sweep) * radius)
    }

    const ticks = p.color(pal.paper)
    ticks.setAlpha(115)
    p.stroke(ticks)
    p.strokeWeight(1)
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * p.TWO_PI
      const inner = maxR + (i % 4 === 0 ? 5 : 10)
      p.line(p.cos(a) * inner, p.sin(a) * inner, p.cos(a) * (maxR + 15), p.sin(a) * (maxR + 15))
    }
  }
}
