import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Orbit { x: number; y: number; trail: { x: number; y: number }[] }
const TRAIL = 420

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const orbits: Orbit[] = []

  const step = (o: Orbit) => {
    const h = 0.004
    for (let i = 0; i < 4; i++) {
      const dx = o.x * (1 - o.y)
      const dy = 0.82 * o.y * (o.x - 1)
      o.x += dx * h
      o.y += dy * h
    }
    o.trail.push({ x: o.x, y: o.y })
    if (o.trail.length > TRAIL) o.trail.shift()
  }

  const reset = () => {
    orbits.length = 0
    for (let i = 0; i < 4; i++) {
      const o = { x: 0.42 + i * 0.22, y: 0.72 + i * 0.12, trail: [] as { x: number; y: number }[] }
      for (let j = 0; j < TRAIL + i * 30; j++) step(o)
      orbits.push(o)
    }
  }

  const sx = (x: number) => p.width * (0.1 + x * 0.265)
  const sy = (y: number) => p.height * (0.9 - y * 0.265)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    reset()
  }

  p.draw = () => {
    p.background(pal.bg)
    const grid = p.color(pal.dim)
    grid.setAlpha(75)
    p.stroke(grid)
    p.strokeWeight(1)
    for (let x = 0.4; x <= 2.8; x += 0.4) {
      for (let y = 0.4; y <= 2.8; y += 0.4) {
        const dx = x * (1 - y)
        const dy = 0.82 * y * (x - 1)
        const len = Math.max(0.001, Math.hypot(dx, dy))
        p.line(sx(x), sy(y), sx(x) + dx / len * 5, sy(y) - dy / len * 5)
      }
    }
    for (let k = 0; k < orbits.length; k++) {
      const o = orbits[k]
      step(o)
      const col = p.color(k === 0 ? pal.signal : pal.dim)
      col.setAlpha(k === 0 ? 220 : 125)
      p.noFill()
      p.stroke(col)
      p.strokeWeight(k === 0 ? 1.8 : 1)
      p.beginShape()
      for (let i = 0; i < o.trail.length; i++) p.vertex(sx(o.trail[i].x), sy(o.trail[i].y))
      p.endShape()
    }
    const lead = orbits[0]
    p.noStroke()
    p.fill(pal.accent)
    p.circle(sx(lead.x), sy(lead.y), 6)
    if (p.frameCount % 1500 === 0) reset()
  }
}
