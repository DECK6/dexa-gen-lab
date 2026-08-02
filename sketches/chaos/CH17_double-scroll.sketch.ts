import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Point = { x: number; z: number }
const TRAIL = 720
const H = 0.003

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const trail: Point[] = []
  let x = 0.12
  let y = 0
  let z = 0
  let age = 0

  const diode = (v: number) => -0.714 * v + 0.5 * (-1.143 + 0.714) * (Math.abs(v + 1) - Math.abs(v - 1))
  const step = () => {
    const dx = 15.6 * (y - x - diode(x))
    const dy = x - y + z
    const dz = -28 * y
    x += dx * H
    y += dy * H
    z += dz * H
    trail.push({ x, z })
    if (trail.length > TRAIL) trail.shift()
  }

  const reseed = () => {
    x = p.random(0.08, 0.16) * (p.random() < 0.5 ? -1 : 1)
    y = p.random(-0.02, 0.02)
    z = p.random(-0.02, 0.02)
    trail.length = 0
    for (let i = 0; i < 7000; i++) step()
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    reseed()
  }

  p.draw = () => {
    p.background(pal.bg)
    for (let i = 0; i < 12; i++) step()
    const scale = Math.min(p.width, p.height) * 0.13
    const cx = p.width / 2
    const cy = p.height / 2
    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1]
      const b = trail[i]
      const col = p.color(b.x >= 0 ? pal.signal : pal.paper)
      col.setAlpha(135 + 120 * i / trail.length)
      p.stroke(col)
      p.strokeWeight(i > trail.length - 60 ? 3.2 : 2.3)
      p.line(cx + a.x * scale, cy + a.z * scale * 0.55, cx + b.x * scale, cy + b.z * scale * 0.55)
    }
    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1]
      const b = trail[i]
      if (a.x * b.x < 0) {
        p.noStroke()
        p.fill(pal.accent)
        p.circle(cx + b.x * scale, cy + b.z * scale * 0.55, 5)
      }
    }
    age++
    if (!Number.isFinite(x) || Math.abs(x) > 8 || age > 1800) reseed()
  }
}
