import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Point = { x: number; y: number }
const TRAIL = 920

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const trail: Point[] = []
  let x = 0
  let y = 0.5
  let mu = -0.496
  let reach = 20
  let age = 0

  const f = (v: number) => mu * v + (2 * (1 - mu) * v * v) / (1 + v * v)
  const step = () => {
    // Canonical Gumowski–Mira recurrence: the nonlinear y feedback is what
    // keeps the orbit circulating through cellular contours instead of settling.
    const nx = y + 0.008 * (1 - 0.05 * y * y) * y + f(x)
    const ny = -x + f(nx)
    x = nx
    y = ny
    reach = Math.max(reach, Math.abs(x), Math.abs(y))
    trail.push({ x, y })
    if (trail.length > TRAIL) trail.shift()
  }

  const reseed = () => {
    mu = p.random(-0.499, -0.493)
    x = p.random(-0.02, 0.02)
    y = p.random(0.48, 0.52)
    reach = 20
    trail.length = 0
    for (let i = 0; i < 2200; i++) step()
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    reseed()
  }

  p.draw = () => {
    p.background(pal.bg)
    for (let i = 0; i < 9; i++) step()
    const scale = (Math.min(p.width, p.height) * 0.43) / reach
    const cx = p.width / 2
    const cy = p.height / 2
    const contour = p.color(pal.signal)
    contour.setAlpha(165)
    p.noFill()
    p.stroke(contour)
    p.strokeWeight(1.35)
    for (let i = 1; i < trail.length; i++) {
      const q = trail[i - 1]
      const r = trail[i]
      if (Math.hypot(r.x - q.x, r.y - q.y) < reach * 0.35) {
        p.line(cx + q.x * scale, cy + q.y * scale, cx + r.x * scale, cy + r.y * scale)
      }
      if (i % 3 === 0) p.point(cx + r.x * scale, cy + r.y * scale)
    }
    const head = trail[trail.length - 1]
    p.noStroke()
    p.fill(pal.accent)
    p.circle(cx + head.x * scale, cy + head.y * scale, 6)
    age++
    if (!Number.isFinite(x) || reach > 60 || age > 1500) reseed()
  }
}
