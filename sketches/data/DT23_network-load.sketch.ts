import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface LoadEdge {
  a: number
  b: number
  load: number
  capacity: number
  phase: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const points = [[0.12, 0.22], [0.36, 0.13], [0.64, 0.16], [0.88, 0.27], [0.2, 0.48], [0.48, 0.39],
    [0.76, 0.5], [0.1, 0.76], [0.34, 0.68], [0.58, 0.8], [0.86, 0.72], [0.5, 0.58]]
  const pairs = [[0, 1], [0, 4], [1, 2], [1, 5], [2, 3], [2, 5], [3, 6], [4, 5], [4, 7], [4, 8],
    [5, 6], [5, 8], [5, 11], [6, 10], [6, 11], [7, 8], [8, 9], [8, 11], [9, 10], [9, 11], [10, 11]]
  const edges: LoadEdge[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (const pair of pairs) edges.push({ a: pair[0], b: pair[1], load: p.random(0.15, 0.65), capacity: p.random(0.65, 1), phase: p.random(p.TWO_PI) })
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.013
    const nodeLoad = Array<number>(points.length).fill(0)
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i]
      const demand = 0.24 + p.noise(i * 0.27, p.frameCount * 0.009) * 0.58 + Math.sin(t + edge.phase) * 0.16
      edge.load += (p.constrain(demand / edge.capacity, 0, 1) - edge.load) * 0.055
      nodeLoad[edge.a] += edge.load
      nodeLoad[edge.b] += edge.load
      const a = points[edge.a]
      const b = points[edge.b]
      const x1 = a[0] * ctx.width
      const y1 = a[1] * ctx.height
      const x2 = b[0] * ctx.width
      const y2 = b[1] * ctx.height
      p.stroke(pal.ink)
      p.strokeWeight(8)
      p.line(x1, y1, x2, y2)
      const heat = p.color(edge.load > 0.72 ? pal.accent : pal.signal)
      heat.setAlpha(60 + edge.load * 190)
      p.stroke(heat)
      p.strokeWeight(0.8 + edge.load * 7)
      p.line(x1, y1, x2, y2)
    }
    for (let i = 0; i < points.length; i++) {
      const heat = p.constrain(nodeLoad[i] / 4, 0, 1)
      p.noStroke()
      p.fill(heat > 0.72 ? pal.accent : pal.paper)
      p.circle(points[i][0] * ctx.width, points[i][1] * ctx.height, 8 + heat * 12)
      p.noFill()
      p.stroke(pal.signal)
      p.strokeWeight(1)
      p.circle(points[i][0] * ctx.width, points[i][1] * ctx.height, 18 + heat * 15)
    }
  }
}
