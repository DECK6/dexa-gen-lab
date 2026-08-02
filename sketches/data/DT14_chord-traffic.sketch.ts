import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Chord {
  a: number
  b: number
  phase: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const chords: Chord[] = []
  const count = 12

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < count; i++) {
      chords.push({ a: i, b: (i * 5 + 3) % count, phase: p.random(p.TWO_PI) })
      chords.push({ a: i, b: (i + 4) % count, phase: p.random(p.TWO_PI) })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.018
    const cx = ctx.width / 2
    const cy = ctx.height / 2
    const radius = Math.min(ctx.width, ctx.height) * 0.38
    const points = Array.from({ length: count }, (_, i) => {
      const angle = i * p.TWO_PI / count - p.HALF_PI
      return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, angle }
    })
    for (const chord of chords) {
      const a = points[chord.a]
      const b = points[chord.b]
      const strength = ((Math.sin(t * (0.65 + chord.a * 0.025) + chord.phase) + 1) / 2) ** 2
      const ink = p.color(strength > 0.86 ? pal.accent : pal.signal)
      ink.setAlpha(24 + strength * 180)
      p.noFill()
      p.stroke(ink)
      p.strokeWeight(0.5 + strength * 5)
      p.bezier(a.x, a.y, cx, cy, cx, cy, b.x, b.y)
      const q = (t * 0.3 + chord.phase / p.TWO_PI) % 1
      const pulseX = (1 - q) ** 3 * a.x + 3 * (1 - q) ** 2 * q * cx + 3 * (1 - q) * q ** 2 * cx + q ** 3 * b.x
      const pulseY = (1 - q) ** 3 * a.y + 3 * (1 - q) ** 2 * q * cy + 3 * (1 - q) * q ** 2 * cy + q ** 3 * b.y
      p.noStroke()
      p.fill(pal.paper)
      p.circle(pulseX, pulseY, 2 + strength * 3)
    }
    p.noFill()
    p.stroke(pal.dim)
    p.strokeWeight(1)
    p.circle(cx, cy, radius * 2)
    for (let i = 0; i < count; i++) {
      const point = points[i]
      p.stroke(i % 4 === 0 ? pal.accent : pal.signal)
      p.strokeWeight(4)
      p.arc(cx, cy, radius * 2, radius * 2, point.angle - 0.09, point.angle + 0.09)
      p.noStroke()
      p.fill(pal.paper)
      p.circle(point.x, point.y, 7)
    }
  }
}
