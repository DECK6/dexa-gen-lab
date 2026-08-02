import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Mote { x: number; y: number; age: number }
const N = 720

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const motes: Mote[] = []

  const reset = (m: Mote, offset = 0) => {
    m.x = p.random(-0.2, 0.2)
    m.y = p.random(-0.2, 0.2)
    m.age = -offset
  }

  const advance = (m: Mote, u: number) => {
    const t = 0.4 - 6 / (1 + m.x * m.x + m.y * m.y)
    const c = Math.cos(t)
    const s = Math.sin(t)
    const nx = 1 + u * (m.x * c - m.y * s)
    m.y = u * (m.x * s + m.y * c)
    m.x = nx
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < N; i++) {
      const m = { x: 0, y: 0, age: 0 }
      reset(m, i % 120)
      for (let j = 0; j < i % 80; j++) advance(m, 0.89)
      motes.push(m)
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(38)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    const u = 0.89 + 0.018 * Math.sin(p.frameCount * 0.006)
    const scale = Math.min(p.width, p.height) * 0.105
    const cx = p.width * 0.4
    const cy = p.height * 0.52
    const flow = p.color(pal.signal)
    flow.setAlpha(75)
    p.stroke(flow)
    p.strokeWeight(1)
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i]
      const ox = m.x
      const oy = m.y
      advance(m, u)
      m.age++
      if (m.age > 0) p.line(cx + ox * scale, cy + oy * scale, cx + m.x * scale, cy + m.y * scale)
      if (m.age > 150 || !Number.isFinite(m.x) || Math.abs(m.x) + Math.abs(m.y) > 14) reset(m)
    }
    const marker = motes[p.frameCount % motes.length]
    p.noStroke()
    p.fill(pal.accent)
    p.circle(cx + marker.x * scale, cy + marker.y * scale, 4.5)
  }
}
