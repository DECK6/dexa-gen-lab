import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const BANDS = 12
const COUNT = 960

interface Mote {
  x: number
  lane: number
  phase: number
  speed: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const motes: Mote[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      motes.push({
        x: p.random(p.width),
        lane: i % BANDS,
        phase: p.random(p.TWO_PI),
        speed: p.random(0.8, 2.7),
      })
    }
    p.strokeCap(p.SQUARE)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(18)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const bandH = p.height / BANDS
    const t = p.frameCount * 0.018
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    const dim = p.color(pal.dim)
    dim.setAlpha(56)
    p.stroke(dim)
    p.strokeWeight(1)
    for (let j = 1; j < BANDS; j++) {
      const y = j * bandH + Math.sin(t * 0.4 + j) * 3
      p.line(0, y, p.width, y)
    }

    for (let i = 0; i < motes.length; i++) {
      const m = motes[i]!
      const dir = m.lane % 2 === 0 ? 1 : -1
      const slip = dir * m.speed * (0.8 + Math.sin(t * 0.35 + m.lane) * 0.2)
      const y0 = (m.lane + 0.5) * bandH + Math.sin(m.x * 0.022 + m.phase + t * dir * 0.2) * bandH * 0.19
      const x1 = m.x + slip
      const y1 = (m.lane + 0.5) * bandH + Math.sin(x1 * 0.022 + m.phase + t * dir * 0.2) * bandH * 0.19
      const col = i % 79 === 0 ? orange : cyan
      col.setAlpha(i % 79 === 0 ? 180 : 78)
      p.stroke(col)
      p.strokeWeight(i % 79 === 0 ? 1.7 : 0.9)
      p.line(m.x, y0, x1, y1)
      m.x = x1
      if (m.x > p.width + 4) m.x = -4
      if (m.x < -4) m.x = p.width + 4
    }
  }
}
