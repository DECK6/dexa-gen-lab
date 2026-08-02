import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const TEXT = 'ORBITAL GLYPH'
const CYCLE = 240

interface Orbiter {
  ch: string
  phase: number
  radius: number
  speed: number
  tx: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const glyphs: Orbiter[] = []

  const smooth = (value: number) => {
    const x = p.constrain(value, 0, 1)
    return x * x * (3 - 2 * x)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    p.noStroke()
    const advance = p.width * 0.058
    const left = p.width * 0.5 - (TEXT.length - 1) * advance * 0.5
    for (let i = 0; i < TEXT.length; i++) {
      if (TEXT.charAt(i) === ' ') continue
      glyphs.push({
        ch: TEXT.charAt(i),
        phase: p.random(p.TWO_PI),
        radius: p.random(p.width * 0.18, p.width * 0.44),
        speed: p.random(0.7, 1.35),
        tx: left + i * advance,
      })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const phase = (p.frameCount % CYCLE) / CYCLE
    const align = phase < 0.32 ? smooth(phase / 0.32) : phase < 0.62 ? 1 : 1 - smooth((phase - 0.62) / 0.38)
    const cx = p.width * 0.5
    const cy = p.height * 0.5
    const guide = p.color(pal.dim)
    guide.setAlpha(42)
    p.noFill()
    p.stroke(guide)
    p.strokeWeight(1)
    for (let i = 0; i < glyphs.length; i += 3) {
      p.ellipse(cx, cy, glyphs[i]!.radius * 2, glyphs[i]!.radius * 1.12)
    }

    p.noStroke()
    p.textSize(p.width * 0.064)
    for (let i = 0; i < glyphs.length; i++) {
      const g = glyphs[i]!
      const a = g.phase + p.frameCount * 0.018 * g.speed
      const ox = cx + Math.cos(a) * g.radius
      const oy = cy + Math.sin(a) * g.radius * 0.56
      const x = p.lerp(ox, g.tx, align)
      const y = p.lerp(oy, cy + Math.sin(a * 2) * 1.4, align)
      const c = p.color(i % 5 === 0 ? pal.accent : pal.signal)
      c.setAlpha(90 + align * 165)
      p.fill(c)
      p.push()
      p.translate(x, y)
      p.rotate((1 - align) * (a + p.HALF_PI))
      p.text(g.ch, 0, 0)
      p.pop()
    }

    const lock = p.color(pal.accent)
    lock.setAlpha(190 * align)
    p.fill(lock)
    p.rect(p.width * 0.08, cy + p.height * 0.07, p.width * 0.84 * align, 2)
  }
}
