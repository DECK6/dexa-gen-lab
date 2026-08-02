import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Point { x: number; y: number; z: number }
const TRAIL = 980
const H = 0.0045

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const trail: Point[] = []
  let x = 0.1
  let y = 0
  let z = 0
  let age = 0

  const step = () => {
    const r2 = x * x + y * y
    const dx = (z - 0.7) * x - 3.5 * y
    const dy = 3.5 * x + (z - 0.7) * y
    const dz = 0.6 + 0.95 * z - z ** 3 / 3 - r2 * (1 + 0.25 * z) + 0.1 * z * x ** 3
    x += dx * H
    y += dy * H
    z += dz * H
    trail.push({ x, y, z })
    if (trail.length > TRAIL) trail.shift()
  }

  const reseed = () => {
    x = p.random(0.08, 0.16)
    y = p.random(-0.03, 0.03)
    z = p.random(-0.03, 0.03)
    trail.length = 0
    for (let i = 0; i < 6800; i++) step()
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
    const turn = p.frameCount * 0.002
    const project = (q: Point) => {
      const u = q.x * Math.cos(turn) - q.y * Math.sin(turn)
      const depth = q.x * Math.sin(turn) + q.y * Math.cos(turn)
      return { x: p.width / 2 + u * p.width * 0.2, y: p.height * 0.53 + (q.z - 0.35 - depth * 0.16) * p.height * 0.2 }
    }
    const axis = p.color(pal.dim)
    axis.setAlpha(120)
    p.stroke(axis)
    p.strokeWeight(1)
    p.line(p.width / 2, p.height * 0.14, p.width / 2, p.height * 0.88)
    const dust = p.color(pal.signal)
    dust.setAlpha(150)
    p.stroke(dust)
    p.strokeWeight(1.25)
    for (let i = 0; i < trail.length; i++) {
      const q = project(trail[i])
      p.point(q.x, q.y)
      if (i > 0 && i % 5 === 0) {
        const a = project(trail[i - 1])
        p.line(a.x, a.y, q.x, q.y)
      }
    }
    const head = project(trail[trail.length - 1])
    p.noStroke()
    p.fill(pal.accent)
    p.circle(head.x, head.y, 6)
    age++
    if (!Number.isFinite(x) || Math.abs(x) > 5 || age > 1600) reseed()
  }
}
