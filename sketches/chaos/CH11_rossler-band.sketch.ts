import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Point = { x: number; y: number }
const TRAIL = 560
const SUBSTEPS = 7
const H = 0.012

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const trail: Point[] = []
  let x = 0.1
  let y = 0
  let z = 0
  let age = 0

  const step = () => {
    const dx = -y - z
    const dy = x + 0.2 * y
    const dz = 0.2 + z * (x - 5.7)
    x += dx * H
    y += dy * H
    z += dz * H
    trail.push({ x, y })
    if (trail.length > TRAIL) trail.shift()
  }

  const reseed = () => {
    x = p.random(0.06, 0.18)
    y = p.random(-0.04, 0.04)
    z = p.random(0.01, 0.08)
    trail.length = 0
    for (let i = 0; i < 4200; i++) step()
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    reseed()
  }

  p.draw = () => {
    p.background(pal.bg)
    for (let i = 0; i < SUBSTEPS; i++) step()
    const scale = Math.min(p.width, p.height) * 0.038
    const cx = p.width * 0.51
    const cy = p.height * 0.52
    const rail = p.color(pal.signal)
    rail.setAlpha(210)
    const ribs = p.color(pal.dim)
    ribs.setAlpha(105)
    p.noFill()
    for (let i = 1; i < trail.length - 1; i++) {
      const a = trail[i - 1]
      const b = trail[i + 1]
      const q = trail[i]
      const len = Math.max(0.001, Math.hypot(b.x - a.x, b.y - a.y))
      const width = 0.12 + 0.2 * (i / trail.length)
      const nx = ((b.y - a.y) / len) * width
      const ny = (-(b.x - a.x) / len) * width
      if (i % 7 === 0) {
        p.stroke(ribs)
        p.strokeWeight(1)
        p.line(cx + (q.x - nx) * scale, cy + (q.y - ny) * scale, cx + (q.x + nx) * scale, cy + (q.y + ny) * scale)
      }
      if (i > 1) {
        const prev = trail[i - 1]
        p.stroke(rail)
        p.strokeWeight(1.25)
        p.line(cx + (prev.x + nx) * scale, cy + (prev.y + ny) * scale, cx + (q.x + nx) * scale, cy + (q.y + ny) * scale)
      }
    }
    const head = trail[trail.length - 1]
    p.noStroke()
    p.fill(pal.accent)
    p.circle(cx + head.x * scale, cy + head.y * scale, 6)
    age++
    if (!Number.isFinite(x) || age > 1800) reseed()
  }
}
