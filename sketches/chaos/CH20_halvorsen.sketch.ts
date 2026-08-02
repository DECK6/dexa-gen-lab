import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Point { x: number; y: number; z: number }
const TRAIL = 680
const H = 0.0018

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const trail: Point[] = []
  let x = 1
  let y = 0
  let z = 0
  let age = 0

  const step = () => {
    const dx = -1.4 * x - 4 * y - 4 * z - y * y
    const dy = -1.4 * y - 4 * z - 4 * x - z * z
    const dz = -1.4 * z - 4 * x - 4 * y - x * x
    x += dx * H
    y += dy * H
    z += dz * H
    trail.push({ x, y, z })
    if (trail.length > TRAIL) trail.shift()
  }

  const reseed = () => {
    x = p.random(0.7, 1.3)
    y = p.random(-0.15, 0.15)
    z = p.random(-0.15, 0.15)
    trail.length = 0
    for (let i = 0; i < 8500; i++) step()
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    reseed()
  }

  p.draw = () => {
    p.background(pal.bg)
    for (let i = 0; i < 15; i++) step()
    const turn = p.frameCount * 0.0015
    const project = (q: Point) => {
      const u = (q.x - q.y) * Math.cos(turn) + q.z * Math.sin(turn)
      const v = (q.x + q.y) * 0.34 - q.z * 0.72
      return { x: p.width / 2 + u * p.width * 0.035, y: p.height / 2 + v * p.height * 0.035 }
    }
    const rail = p.color(pal.signal)
    rail.setAlpha(205)
    const rib = p.color(pal.dim)
    rib.setAlpha(105)
    for (let i = 1; i < trail.length - 1; i++) {
      const a = project(trail[i - 1])
      const b = project(trail[i])
      const c = project(trail[i + 1])
      const len = Math.max(0.001, Math.hypot(c.x - a.x, c.y - a.y))
      const nx = (c.y - a.y) / len * 2.4
      const ny = -(c.x - a.x) / len * 2.4
      p.stroke(rail)
      p.strokeWeight(1.15)
      p.line(a.x + nx, a.y + ny, b.x + nx, b.y + ny)
      if (i % 8 === 0) {
        p.stroke(rib)
        p.line(b.x - nx, b.y - ny, b.x + nx, b.y + ny)
      }
    }
    const head = project(trail[trail.length - 1])
    p.noStroke()
    p.fill(pal.accent)
    p.circle(head.x, head.y, 6)
    age++
    if (!Number.isFinite(x) || Math.abs(x) > 30 || age > 1600) reseed()
  }
}
