import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const FOOD = 8
const JUNCTIONS = 6

type Node = { x: number; y: number }
type Edge = { a: number; b: number; len: number; trail: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const nodes: Node[] = []
  const edges: Edge[] = []

  const connect = (a: number, b: number) => {
    if (a === b || edges.some((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))) return
    edges.push({ a, b, len: Math.hypot(nodes[a]!.x - nodes[b]!.x, nodes[a]!.y - nodes[b]!.y), trail: 0.025 })
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < FOOD; i++) {
      const a = (i / FOOD) * p.TWO_PI + p.random(-0.12, 0.12)
      nodes.push({ x: p.width / 2 + Math.cos(a) * p.width * p.random(0.32, 0.4), y: p.height / 2 + Math.sin(a) * p.height * p.random(0.27, 0.38) })
    }
    for (let i = 0; i < JUNCTIONS; i++) {
      const a = (i / JUNCTIONS) * p.TWO_PI + 0.3
      nodes.push({ x: p.width / 2 + Math.cos(a) * p.width * p.random(0.1, 0.2), y: p.height / 2 + Math.sin(a) * p.height * p.random(0.1, 0.2) })
    }
    for (let i = 0; i < FOOD; i++) {
      connect(i, FOOD + (i % JUNCTIONS))
      connect(i, FOOD + ((i + 1) % JUNCTIONS))
    }
    for (let i = 0; i < JUNCTIONS; i++) {
      connect(FOOD + i, FOOD + ((i + 1) % JUNCTIONS))
      connect(FOOD + i, FOOD + ((i + 2) % JUNCTIONS))
    }
  }

  const reinforce = (start: number, goal: number) => {
    const dist = Array<number>(nodes.length).fill(Infinity)
    const prev = Array<number>(nodes.length).fill(-1)
    const used = Array<boolean>(nodes.length).fill(false)
    dist[start] = 0
    for (let step = 0; step < nodes.length; step++) {
      let u = -1
      for (let i = 0; i < nodes.length; i++) if (!used[i] && (u < 0 || dist[i]! < dist[u]!)) u = i
      if (u < 0 || !Number.isFinite(dist[u]!) || u === goal) break
      used[u] = true
      for (let ei = 0; ei < edges.length; ei++) {
        const e = edges[ei]!
        const v = e.a === u ? e.b : e.b === u ? e.a : -1
        if (v < 0) continue
        const cost = e.len / (0.16 + e.trail * 4)
        if (dist[u]! + cost >= dist[v]!) continue
        dist[v] = dist[u]! + cost
        prev[v] = ei
      }
    }
    for (let at = goal; at !== start && prev[at]! >= 0; ) {
      const e = edges[prev[at]!]!
      e.trail = Math.min(1.4, e.trail + 0.055)
      at = e.a === at ? e.b : e.a
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    for (const e of edges) e.trail *= 0.993
    for (let i = 0; i < 6; i++) {
      const a = Math.floor(p.random(FOOD))
      const b = (a + 1 + Math.floor(p.random(FOOD - 1))) % FOOD
      reinforce(a, b)
    }
    const base = p.color(pal.dim)
    const tube = p.color(pal.signal)
    for (const e of edges) {
      const a = nodes[e.a]!
      const b = nodes[e.b]!
      base.setAlpha(35)
      p.stroke(base)
      p.strokeWeight(1)
      p.line(a.x, a.y, b.x, b.y)
      tube.setAlpha(35 + Math.min(190, e.trail * 180))
      p.stroke(tube)
      p.strokeWeight(0.5 + e.trail * 3.2)
      p.line(a.x, a.y, b.x, b.y)
    }
    const food = p.color(pal.accent)
    food.setAlpha(210)
    p.noStroke()
    p.fill(food)
    for (let i = 0; i < FOOD; i++) {
      const q = nodes[i]!
      p.ellipse(q.x, q.y, 6 + Math.sin(p.frameCount * 0.05 + i) * 1.5)
    }
  }
}
