import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const VARIANT = 2

export function sketch(p: P5, ctx: SketchCtx): void {
  const nodes: { x: number; y: number; phase: number }[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    const count = 18 + VARIANT * 2
    for (let i = 0; i < count; i++) nodes.push({ x: p.random(70, ctx.width - 70), y: p.random(70, ctx.height - 70), phase: p.random(p.TWO_PI) })
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const t = p.frameCount * 0.012
    const positions = nodes.map((node, i) => ({
      x: node.x + Math.cos(t * (0.7 + (i % 3) * 0.13) + node.phase) * (7 + VARIANT),
      y: node.y + Math.sin(t * (0.8 + (i % 4) * 0.11) + node.phase) * (7 + VARIANT),
    }))
    const threshold = 105 + VARIANT * 7
    p.strokeWeight(1)
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i]!
        const b = positions[j]!
        const distance = p.dist(a.x, a.y, b.x, b.y)
        if (distance > threshold) continue
        const edge = p.color(ctx.palette.signal)
        edge.setAlpha(30 + (1 - distance / threshold) * 100)
        p.stroke(edge)
        p.line(a.x, a.y, b.x, b.y)
        if ((i + j + VARIANT) % 7 === 0) {
          const q = (t * 0.4 + i * 0.13 + j * 0.07) % 1
          p.noStroke()
          p.fill(ctx.palette.accent)
          p.circle(p.lerp(a.x, b.x, q), p.lerp(a.y, b.y, q), 5)
        }
      }
    }
    for (let i = 0; i < positions.length; i++) {
      p.noStroke()
      p.fill(i % 5 === 0 ? ctx.palette.accent : ctx.palette.paper)
      p.circle(positions[i]!.x, positions[i]!.y, 5 + Math.sin(t * 2 + i) * 2)
    }
  }
}
