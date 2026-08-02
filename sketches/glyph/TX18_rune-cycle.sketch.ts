import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const RUNES = [
  [-0.5, 0.6, 0, -0.6, 0, -0.6, 0.5, 0.6, -0.3, 0.15, 0.3, 0.15],
  [-0.45, -0.6, -0.45, 0.6, -0.45, -0.2, 0.4, -0.55, -0.45, -0.2, 0.4, 0.45],
  [-0.5, -0.5, 0.5, -0.5, 0, -0.5, 0, 0.6, -0.45, 0.15, 0.45, 0.15],
  [-0.45, -0.6, 0.45, 0, 0.45, 0, -0.45, 0.6, -0.25, -0.35, -0.25, 0.35],
  [0, -0.65, 0, 0.65, -0.5, -0.2, 0, 0.1, 0.5, -0.2, 0, 0.1],
  [-0.5, -0.55, 0.5, 0.55, 0.5, -0.55, -0.5, 0.55, -0.5, 0, 0.5, 0],
]
const COUNT = 12
const CYCLE = 240

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    p.strokeWeight(Math.max(1.4, p.width * 0.003))
  }

  p.draw = () => {
    p.background(pal.bg)
    const cx = p.width * 0.5
    const cy = p.height * 0.5
    const radius = p.width * 0.34
    const clock = (p.frameCount - 1) % CYCLE
    const ring = p.color(pal.dim)
    ring.setAlpha(85)
    p.noFill()
    p.stroke(ring)
    p.circle(cx, cy, radius * 2)

    for (let i = 0; i < COUNT; i++) {
      const draw = p.constrain((clock - i * 5) / 40, 0, 1)
      const erase = p.constrain((clock - 145 - i * 2) / 45, 0, 1)
      const progress = draw * (1 - erase)
      const rune = RUNES[i % RUNES.length]!
      const segments = rune.length / 4
      const units = progress * segments
      const a = i * p.TWO_PI / COUNT - p.HALF_PI
      const ink = p.color(i % 5 === 0 ? pal.accent : pal.signal)
      ink.setAlpha(70 + progress * 185)
      p.stroke(ink)
      p.push()
      p.translate(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius)
      p.rotate(a + p.HALF_PI)
      const size = p.width * 0.055
      for (let s = 0; s < segments; s++) {
        const k = p.constrain(units - s, 0, 1)
        if (k <= 0) continue
        const x1 = rune[s * 4]!
        const y1 = rune[s * 4 + 1]!
        const x2 = p.lerp(x1, rune[s * 4 + 2]!, k)
        const y2 = p.lerp(y1, rune[s * 4 + 3]!, k)
        p.line(x1 * size, y1 * size, x2 * size, y2 * size)
      }
      p.pop()
    }

    const markerA = p.frameCount * 0.025
    p.noStroke()
    p.fill(pal.accent)
    p.circle(cx + Math.cos(markerA) * radius, cy + Math.sin(markerA) * radius, p.width * 0.014)
  }
}
