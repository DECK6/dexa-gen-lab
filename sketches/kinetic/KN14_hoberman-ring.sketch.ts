import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Point = { x: number; y: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const center = { x: ctx.width * 0.5, y: ctx.height * 0.5 }
    const count = 14
    const step = p.TWO_PI / count
    const time = p.frameCount * 0.018
    const radius = size * (0.24 + Math.sin(time) * 0.075)
    const gap = size * 0.055
    const rotation = time * 0.12
    const ring = (r: number, offset: number): Point[] => Array.from({ length: count }, (_, i) => {
      const angle = rotation + i * step + offset
      return { x: center.x + Math.cos(angle) * r, y: center.y + Math.sin(angle) * r }
    })
    const inner = ring(radius - gap, 0)
    const outer = ring(radius + gap, step * 0.5)
    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    p.circle(center.x, center.y, radius * 2)
    p.circle(center.x, center.y, (radius + gap * 1.7) * 2)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(3)
    for (let i = 0; i < count; i++) {
      const next = (i + 1) % count
      p.line(inner[i]!.x, inner[i]!.y, outer[i]!.x, outer[i]!.y)
      p.line(inner[next]!.x, inner[next]!.y, outer[i]!.x, outer[i]!.y)
    }
    p.noStroke()
    for (let i = 0; i < count; i++) {
      p.fill(i % 4 === 0 ? ctx.palette.accent : ctx.palette.paper)
      p.circle(inner[i]!.x, inner[i]!.y, 8)
      p.circle(outer[i]!.x, outer[i]!.y, 8)
    }
    p.fill(ctx.palette.ink)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.circle(center.x, center.y, 24)
  }
}
