import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Grain { x: number; y: number; life: number }
const N = 1100

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const grains: Grain[] = []

  const step = (g: Grain) => {
    const nx = g.x * g.x - g.y * g.y + 0.9 * g.x - 0.6013 * g.y
    g.y = 2 * g.x * g.y + 2 * g.x + 0.5 * g.y
    g.x = nx
  }

  const reset = (g: Grain, life = 0) => {
    g.x = -0.72 + p.random(-0.018, 0.018)
    g.y = -0.64 + p.random(-0.018, 0.018)
    g.life = life
    for (let i = 0; i < life % 95; i++) step(g)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < N; i++) {
      const g = { x: 0, y: 0, life: 0 }
      reset(g, i % 120)
      grains.push(g)
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(30)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    const dust = p.color(pal.signal)
    dust.setAlpha(95)
    p.stroke(dust)
    p.strokeWeight(1.15)
    const scale = Math.min(p.width, p.height) * 0.14
    const cx = p.width * 0.6
    const cy = p.height * 0.59
    for (let i = 0; i < grains.length; i++) {
      const g = grains[i]
      step(g)
      g.life++
      if (Number.isFinite(g.x) && Math.abs(g.x) < 2.8 && Math.abs(g.y) < 3.4) {
        p.point(cx + g.x * scale, cy + g.y * scale)
      } else reset(g, i % 40)
      if (g.life > 420) reset(g, i % 80)
    }
    const lead = grains[p.frameCount % grains.length]
    p.noStroke()
    p.fill(pal.accent)
    p.circle(cx + lead.x * scale, cy + lead.y * scale, 5)
  }
}
