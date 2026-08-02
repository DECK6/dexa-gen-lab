import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const LINES = [
  'SUBJECT: GENERATIVE GLYPH ARRAY',
  'STATUS: SIGNAL CHANNEL ACTIVE',
  'LOCATION: DEXA GEN LAB / SEOUL',
  'PAYLOAD: ALGORITHMIC TYPE SYSTEM',
  'ACCESS: INSTRUMENT CLEARANCE 07',
]
const BARS = [
  { row: 0, start: 9, length: 18, delay: 0 },
  { row: 1, start: 8, length: 14, delay: 32 },
  { row: 1, start: 23, length: 6, delay: 8 },
  { row: 2, start: 10, length: 12, delay: 56 },
  { row: 3, start: 9, length: 20, delay: 18 },
  { row: 4, start: 8, length: 11, delay: 72 },
  { row: 4, start: 21, length: 7, delay: 42 },
]
const CYCLE = 240

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette

  const smooth = (value: number) => {
    const x = p.constrain(value, 0, 1)
    return x * x * (3 - 2 * x)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.LEFT, p.CENTER)
    p.noStroke()
  }

  p.draw = () => {
    p.background(pal.bg)
    const left = p.width * 0.085
    const top = p.height * 0.25
    const lineH = p.height * 0.12
    const charW = p.width * 0.0255
    const barH = p.height * 0.047
    p.textSize(p.width * 0.025)

    for (let row = 0; row < LINES.length; row++) {
      const ink = p.color(pal.signal)
      ink.setAlpha(115)
      p.fill(ink)
      p.text(LINES[row]!, left, top + row * lineH)
      const rule = p.color(pal.dim)
      rule.setAlpha(55)
      p.fill(rule)
      p.rect(left, top + row * lineH + barH * 0.75, p.width * 0.82, 1)
    }

    for (let i = 0; i < BARS.length; i++) {
      const bar = BARS[i]!
      const phase = ((p.frameCount + bar.delay) % CYCLE) / CYCLE
      const cover = phase < 0.22 ? smooth(phase / 0.22) : phase < 0.55 ? 1 : phase < 0.79 ? 1 - smooth((phase - 0.55) / 0.24) : 0
      if (cover <= 0) continue
      const full = bar.length * charW
      const width = full * cover
      const fromRight = i % 2 === 1
      const x = left + bar.start * charW + (fromRight ? full - width : 0)
      const y = top + bar.row * lineH - barH * 0.5
      const redact = p.color(pal.signal)
      redact.setAlpha(205)
      p.fill(redact)
      p.rect(x, y, width, barH, p.width * 0.006)
      const head = p.color(pal.accent)
      head.setAlpha(235)
      p.fill(head)
      p.rect(fromRight ? x : x + width - 3, y, 3, barH)
    }

    const meter = p.color(pal.accent)
    meter.setAlpha(190)
    p.fill(meter)
    p.rect(left, p.height * 0.88, p.width * 0.82 * ((p.frameCount % CYCLE) / CYCLE), 2)
  }
}
