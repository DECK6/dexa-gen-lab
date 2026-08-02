import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Point {
  x: number
  y: number
}

type Tri = [Point, Point, Point]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  const children = (t: Tri): Tri[] => {
    const [a, b, c] = t
    const ab = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    const ac = { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 }
    const bc = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 }
    return [[a, ab, ac], [ab, b, bc], [ac, bc, c]]
  }

  const outline = (t: Tri) => {
    p.beginShape()
    for (const q of t) p.vertex(q.x, q.y)
    p.endShape(p.CLOSE)
  }

  const fold = (source: Tri, target: Tri, f: number): Tri => [
    { x: p.lerp(source[0].x, target[0].x, f), y: p.lerp(source[0].y, target[0].y, f) },
    { x: p.lerp(source[1].x, target[1].x, f), y: p.lerp(source[1].y, target[1].y, f) },
    { x: p.lerp(source[2].x, target[2].x, f), y: p.lerp(source[2].y, target[2].y, f) },
  ]

  const subdivide = (t: Tri, depth: number, target: number, f: number) => {
    if (depth === target) {
      for (const child of children(t)) outline(fold(t, child, f))
      return
    }
    for (const child of children(t)) subdivide(child, depth + 1, target, f)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    p.noFill()
  }

  p.draw = () => {
    p.background(pal.bg)
    const cycle = p.frameCount / 180
    const target = 2 + (Math.floor(cycle) % 3)
    const u = cycle - Math.floor(cycle)
    const f = u * u * (3 - 2 * u)
    const r = Math.min(p.width, p.height) * 0.45
    const root: Tri = [
      { x: 0, y: -r },
      { x: -r * 0.92, y: r * 0.72 },
      { x: r * 0.92, y: r * 0.72 },
    ]
    const cyan = p.color(pal.signal)
    cyan.setAlpha(175)
    p.stroke(cyan)
    p.strokeWeight(Math.max(0.7, 1.55 - target * 0.17))
    p.push()
    p.translate(p.width / 2, p.height / 2)
    p.rotate(Math.sin(p.frameCount * 0.006 + phase) * 0.08)
    subdivide(root, 0, target, f)
    const hot = p.color(pal.accent)
    hot.setAlpha(220)
    p.stroke(hot)
    p.strokeWeight(2.4)
    for (const q of root) p.point(q.x, q.y)
    p.pop()
  }
}
