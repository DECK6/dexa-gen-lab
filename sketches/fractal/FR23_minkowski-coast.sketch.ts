import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Point {
  x: number
  y: number
}

const ORDER = 3
const PULSE = 52

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let rule = 'F'
  let phase = 0

  const expand = (src: string): string => {
    let out = ''
    for (const ch of src) out += ch === 'F' ? 'F+F-F-FF+F+F-F' : ch
    return out
  }

  const coast = (turn: number): Point[] => {
    const points: Point[] = [{ x: 0, y: 0 }]
    let x = 0
    let y = 0
    let angle = 0
    for (const ch of rule) {
      if (ch === 'F') {
        x += Math.cos(angle)
        y += Math.sin(angle)
        points.push({ x, y })
      } else if (ch === '+') angle += turn
      else if (ch === '-') angle -= turn
    }
    return points
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    for (let i = 0; i < ORDER; i++) rule = expand(rule)
    p.noFill()
  }

  p.draw = () => {
    p.background(pal.bg)
    const turn = p.HALF_PI * (0.83 + 0.15 * Math.sin(p.frameCount * 0.008 + phase))
    const points = coast(turn)
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
    const scale = Math.min((p.width * 0.86) / Math.max(maxX - minX, 1), (p.height * 0.72) / Math.max(maxY - minY, 1))
    const ox = p.width / 2 - ((minX + maxX) * scale) / 2
    const oy = p.height / 2 - ((minY + maxY) * scale) / 2
    const cyan = p.color(pal.signal)
    cyan.setAlpha(175)
    p.stroke(cyan)
    p.strokeWeight(1.2)
    p.beginShape()
    for (const q of points) p.vertex(ox + q.x * scale, oy + q.y * scale)
    p.endShape()

    const head = Math.floor((p.frameCount * 5) % (points.length - PULSE))
    const hot = p.color(pal.accent)
    hot.setAlpha(220)
    p.stroke(hot)
    p.strokeWeight(2)
    p.beginShape()
    for (let i = head; i < head + PULSE; i++) p.vertex(ox + points[i]!.x * scale, oy + points[i]!.y * scale)
    p.endShape()
  }
}
