import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Point {
  x: number
  y: number
}

const ORDER = 11
const PULSE = 130

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  const refine = (src: Point[], fold: number): Point[] => {
    const out: Point[] = []
    for (let i = 0; i < src.length - 1; i++) {
      const a = src[i]!
      const b = src[i + 1]!
      out.push(a, {
        x: (a.x + b.x) / 2 + ((b.y - a.y) * fold) / 2,
        y: (a.y + b.y) / 2 - ((b.x - a.x) * fold) / 2,
      })
    }
    out.push(src[src.length - 1]!)
    return out
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    p.noFill()
  }

  p.draw = () => {
    p.background(pal.bg)
    const growth = 4 + 7 * (0.5 - 0.5 * Math.cos(p.frameCount * 0.0065 + phase))
    let points: Point[] = [{ x: -1, y: 0 }, { x: 1, y: 0 }]
    for (let depth = 0; depth < ORDER; depth++) points = refine(points, p.constrain(growth - depth, 0, 1))

    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (const q of points) {
      minX = Math.min(minX, q.x)
      maxX = Math.max(maxX, q.x)
      minY = Math.min(minY, q.y)
      maxY = Math.max(maxY, q.y)
    }
    const scale = Math.min(
      (p.width * 0.82) / Math.max(maxX - minX, 0.01),
      (p.height * 0.82) / Math.max(maxY - minY, 0.01),
    )
    const ox = p.width / 2 - ((minX + maxX) * scale) / 2
    const oy = p.height / 2 - ((minY + maxY) * scale) / 2
    const cyan = p.color(pal.signal)
    cyan.setAlpha(175)
    p.stroke(cyan)
    p.strokeWeight(1.15)
    p.beginShape()
    for (const q of points) p.vertex(ox + q.x * scale, oy + q.y * scale)
    p.endShape()

    const head = Math.floor((p.frameCount * 9) % (points.length - PULSE))
    const hot = p.color(pal.accent)
    hot.setAlpha(220)
    p.stroke(hot)
    p.strokeWeight(1.8)
    p.beginShape()
    for (let i = head; i < head + PULSE; i++) {
      const q = points[i]!
      p.vertex(ox + q.x * scale, oy + q.y * scale)
    }
    p.endShape()
  }
}
