import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Point = [number, number]
interface Tri {
  a: Point
  b: Point
  c: Point
  depth: number
}

const DEPTH = 4

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const tris: Tri[] = []
  let phase = 0

  const subdivide = (a: Point, b: Point, c: Point, depth: number) => {
    tris.push({ a, b, c, depth })
    if (depth >= DEPTH) return
    const ab: Point = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const bc: Point = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2]
    const ca: Point = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2]
    subdivide(a, ab, ca, depth + 1)
    subdivide(ab, b, bc, depth + 1)
    subdivide(ca, bc, c, depth + 1)
    subdivide(ab, bc, ca, depth + 1)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    phase = p.random(p.TWO_PI)
    const pad = p.width * 0.07
    subdivide([p.width / 2, pad], [p.width - pad, p.height - pad], [pad, p.height - pad], 0)
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.035 + phase
    for (const tri of tris) {
      const cx = (tri.a[0] + tri.b[0] + tri.c[0]) / 3
      const cy = (tri.a[1] + tri.b[1] + tri.c[1]) / 3
      const wave = p.sin(t - (cx + cy) * 0.013 - tri.depth * 0.7)
      const progress = 0.3 + 0.7 * (0.5 + 0.5 * wave)
      const hot = wave > 0.86 && tri.depth >= 2
      const line = p.color(hot ? pal.accent : tri.depth === DEPTH ? pal.signal : pal.dim)
      line.setAlpha(hot ? 220 : tri.depth === DEPTH ? 55 + progress * 95 : 45)
      p.stroke(line)
      p.strokeWeight(hot ? 1.55 : 1)
      for (const [u, v] of [[tri.a, tri.b], [tri.b, tri.c], [tri.c, tri.a]] as [Point, Point][]) {
        p.line(u[0], u[1], p.lerp(u[0], v[0], progress), p.lerp(u[1], v[1], progress))
      }
    }
  }
}
