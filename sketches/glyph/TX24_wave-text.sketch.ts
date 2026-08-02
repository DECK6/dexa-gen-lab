import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const LINES = [
  'SIGNAL FOLLOWS THE BASELINE',
  'DEXA GENERATIVE TYPE SYSTEM',
  'WAVE CARRIES EVERY GLYPH',
  'PHASE LOCK / PHASE RELEASE',
  'TEXT BENDS BUT STAYS LEGIBLE',
]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(p.width * 0.023)
  }

  p.draw = () => {
    p.background(pal.bg)
    const time = p.frameCount * 0.035
    const left = p.width * 0.075
    const span = p.width * 0.85

    for (let row = 0; row < LINES.length; row++) {
      const text = LINES[row]!
      const base = p.height * (0.22 + row * 0.145)
      const waveY = (u: number) => base
        + Math.sin(u * p.TWO_PI * 1.45 - time * (0.75 + row * 0.08) + row) * p.height * 0.034
        + Math.sin(u * p.TWO_PI * 3.1 + time * 0.43) * p.height * 0.012

      const guide = p.color(pal.dim)
      guide.setAlpha(72)
      p.noFill()
      p.stroke(guide)
      p.beginShape()
      for (let i = 0; i <= text.length; i++) {
        const u = i / text.length
        p.vertex(left + u * span, waveY(u))
      }
      p.endShape()

      p.noStroke()
      const pulse = (p.frameCount * 0.16 + row * 5) % text.length
      for (let i = 0; i < text.length; i++) {
        const u = (i + 0.5) / text.length
        const du = 0.002
        const slope = (waveY(u + du) - waveY(u - du)) / (span * du * 2)
        const c = p.color(Math.abs(i - pulse) < 1 ? pal.accent : pal.signal)
        c.setAlpha(135 + 90 * (0.5 + 0.5 * Math.sin(time + i * 0.18)))
        p.fill(c)
        p.push()
        p.translate(left + u * span, waveY(u))
        p.rotate(Math.atan(slope))
        p.text(text.charAt(i), 0, 0)
        p.pop()
      }
    }
  }
}
