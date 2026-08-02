import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Relation {
  a: number
  b: number
  magnitude: number
  phase: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const relations: Relation[] = []
  const count = 11

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.textFont('monospace')
    for (let i = 0; i < count; i++) {
      relations.push({ a: i, b: (i * 3 + 4) % count, magnitude: p.random(0.45, 1), phase: p.random(p.TWO_PI) })
      relations.push({ a: i, b: (i + 2) % count, magnitude: p.random(0.3, 0.8), phase: p.random(p.TWO_PI) })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.012
    const cx = ctx.width / 2
    const cy = ctx.height / 2
    const radius = Math.min(ctx.width, ctx.height) * 0.36
    const points = Array.from({ length: count }, (_, i) => {
      const angle = i * p.TWO_PI / count - p.HALF_PI
      const r = radius * (0.84 + (i % 3) * 0.08)
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r }
    })
    const totals = Array<number>(count).fill(0)
    for (const relation of relations) {
      const correlation = Math.sin(t * (0.7 + relation.a * 0.019) + relation.phase) * relation.magnitude
      const strength = Math.abs(correlation)
      totals[relation.a] += strength
      totals[relation.b] += strength
      const edge = p.color(correlation < -0.42 ? pal.accent : pal.signal)
      edge.setAlpha(20 + strength * 175)
      p.stroke(edge)
      p.strokeWeight(0.5 + strength * 6)
      p.line(points[relation.a].x, points[relation.a].y, points[relation.b].x, points[relation.b].y)
    }
    for (let i = 0; i < count; i++) {
      p.noStroke()
      p.fill(pal.ink)
      p.circle(points[i].x, points[i].y, 18 + totals[i] * 3)
      p.noFill()
      p.stroke(i % 5 === 0 ? pal.accent : pal.paper)
      p.strokeWeight(2)
      p.circle(points[i].x, points[i].y, 12 + totals[i] * 2)
      p.noStroke()
      p.fill(pal.dim)
      p.textSize(8)
      p.text(`V${String(i).padStart(2, '0')}`, points[i].x + 10, points[i].y - 9)
    }
  }
}
