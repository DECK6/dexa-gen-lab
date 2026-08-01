import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const WORDS = ['DEXA', 'GEN LAB', 'GENERATIVE']
const CYCLE = 280

interface Glyph {
  ch: string
  hx: number
  hy: number
  sx: number
  sy: number
  rot: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let glyphs: Glyph[] = []
  let word = 0

  const smooth = (x: number) => {
    const c = p.constrain(x, 0, 1)
    return c * c * (3 - 2 * c)
  }

  const build = (index: number) => {
    const text = WORDS[index % WORDS.length]!
    const size = Math.min(p.width * 0.78 / (text.length * 0.62), p.height * 0.3)
    p.textSize(size)
    const adv = size * 0.62
    const left = p.width * 0.5 - (text.length - 1) * adv * 0.5
    glyphs = []
    for (let i = 0; i < text.length; i++) {
      const ch = text.charAt(i)
      if (ch === ' ') continue
      glyphs.push({
        ch,
        hx: left + i * adv,
        hy: p.height * 0.5,
        sx: p.random(p.width * 0.08, p.width * 0.92),
        sy: p.random(p.height * 0.08, p.height * 0.92),
        rot: p.random(-p.PI, p.PI),
        hot: p.random() < 0.18,
      })
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    p.noStroke()
    build(word)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(46)
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const phase = (p.frameCount % CYCLE) / CYCLE
    if (p.frameCount % CYCLE === 1 && p.frameCount > 1) {
      word++
      build(word)
    }

    // 0 = scattered, 1 = assembled
    const k = phase < 0.38 ? smooth(phase / 0.38) : phase < 0.78 ? 1 : 1 - smooth((phase - 0.78) / 0.22)
    const t = p.frameCount * 0.02

    for (let i = 0; i < glyphs.length; i++) {
      const g = glyphs[i]!
      const jx = (p.noise(i * 7.3, t) - 0.5) * (6 + 40 * (1 - k))
      const jy = (p.noise(i * 7.3 + 91, t) - 0.5) * (6 + 40 * (1 - k))
      const x = p.lerp(g.sx, g.hx, k) + jx
      const y = p.lerp(g.sy, g.hy, k) + jy
      const c = p.color(g.hot ? pal.accent : pal.signal)
      c.setAlpha(70 + 185 * k)
      p.fill(c)
      p.push()
      p.translate(x, y)
      p.rotate(g.rot * (1 - k))
      p.text(g.ch, 0, 0)
      p.pop()
    }

    // trace of the assembled baseline
    const rule = p.color(pal.dim)
    rule.setAlpha(50 + 60 * k)
    p.fill(rule)
    p.rect(p.width * 0.08, p.height * 0.5 + p.height * 0.09, p.width * 0.84 * k, 1)
  }
}
