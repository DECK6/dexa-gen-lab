import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SET = 'DEXAGENLAB0123456789+*/?'
const BINS = 18
const CYCLE = 360

interface FallingGlyph {
  ch: string
  x: number
  y: number
  vy: number
  rot: number
  vr: number
  size: number
  bin: number
  settled: boolean
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let glyphs: FallingGlyph[] = []
  const stacks = new Array<number>(BINS).fill(0)

  const spawn = () => {
    const bin = Math.floor(p.random(BINS))
    const size = p.random(p.width * 0.035, p.width * 0.062)
    glyphs.push({
      ch: SET.charAt(Math.floor(p.random(SET.length))),
      x: (bin + p.random(0.2, 0.8)) * p.width / BINS,
      y: -size,
      vy: p.random(0.5, 2.4),
      rot: p.random(-0.5, 0.5),
      vr: p.random(-0.045, 0.045),
      size,
      bin,
      settled: false,
      hot: p.random() < 0.08,
    })
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    p.noStroke()
  }

  p.draw = () => {
    const phase = (p.frameCount - 1) % CYCLE
    if (phase === 0) {
      glyphs = []
      stacks.fill(0)
    }
    if (phase < 300 && p.frameCount % 3 === 0 && glyphs.length < 150) spawn()
    p.background(pal.bg)
    const floor = p.height * 0.9
    const fade = p.constrain((CYCLE - phase) / 40, 0, 1)

    for (const glyph of glyphs) {
      if (!glyph.settled) {
        glyph.vy += 0.3
        glyph.y += glyph.vy
        glyph.rot += glyph.vr
        const contact = floor - stacks[glyph.bin]!
        if (glyph.y + glyph.size * 0.42 >= contact) {
          glyph.y = contact - glyph.size * 0.42
          if (glyph.vy > 1.45) {
            glyph.vy *= -0.27
            glyph.vr *= 0.72
          } else {
            glyph.vy = 0
            glyph.settled = true
            stacks[glyph.bin]! += glyph.size * 0.68
          }
        }
      }
      const c = p.color(glyph.hot ? pal.accent : pal.signal)
      c.setAlpha((glyph.settled ? 205 : 150) * fade)
      p.fill(c)
      p.textSize(glyph.size)
      p.push()
      p.translate(glyph.x, glyph.y)
      p.rotate(glyph.rot)
      p.text(glyph.ch, 0, 0)
      p.pop()
    }

    const ground = p.color(pal.dim)
    ground.setAlpha(130 * fade)
    p.fill(ground)
    p.rect(p.width * 0.06, floor, p.width * 0.88, 2)
    p.fill(pal.accent)
    p.rect(p.width * 0.06, floor, p.width * 0.08, 3)
  }
}
