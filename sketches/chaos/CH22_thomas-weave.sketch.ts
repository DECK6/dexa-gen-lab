import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Point { x: number; y: number; z: number }
const TRAIL = 820
const H = 0.028

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const trail: Point[] = []
  let x = 0.1
  let y = 0
  let z = 0
  let age = 0

  const step = () => {
    const dx = Math.sin(y) - 0.208186 * x
    const dy = Math.sin(z) - 0.208186 * y
    const dz = Math.sin(x) - 0.208186 * z
    x += dx * H
    y += dy * H
    z += dz * H
    trail.push({ x, y, z })
    if (trail.length > TRAIL) trail.shift()
  }

  const reseed = () => {
    x = p.random(0.05, 0.18)
    y = p.random(-0.08, 0.08)
    z = p.random(-0.08, 0.08)
    trail.length = 0
    for (let i = 0; i < 4300; i++) step()
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    reseed()
  }

  p.draw = () => {
    p.background(pal.bg)
    for (let i = 0; i < 4; i++) step()
    const turn = p.frameCount * 0.0012
    const project = (q: Point) => {
      const u = (q.x - q.y) * 0.62 * Math.cos(turn) + q.z * 0.42 * Math.sin(turn)
      const v = (q.x + q.y) * 0.32 - q.z * 0.58
      return { x: p.width / 2 + u * p.width * 0.12, y: p.height / 2 + v * p.height * 0.12 }
    }
    const over = p.color(pal.signal)
    over.setAlpha(225)
    const under = p.color(pal.paper)
    under.setAlpha(155)
    p.noFill()
    for (let i = 1; i < trail.length; i++) {
      const a = project(trail[i - 1])
      const b = project(trail[i])
      p.stroke(i % 18 < 9 ? over : under)
      p.strokeWeight(i % 18 === 9 ? 2.8 : 1.8)
      p.line(a.x, a.y, b.x, b.y)
      if (i % 36 === 0) {
        p.noStroke()
        p.fill(pal.paper)
        p.circle(b.x, b.y, 3.6)
      }
    }
    const head = project(trail[trail.length - 1])
    p.noStroke()
    p.fill(pal.accent)
    p.circle(head.x, head.y, 5.5)
    age++
    if (!Number.isFinite(x) || Math.abs(x) > 12 || age > 1800) reseed()
  }
}
