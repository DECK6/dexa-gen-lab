import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const LINES = ['> LOAD GLYPH MATRIX', '> SEED 0007 / ONLINE', '> RUN TYPE CYCLE_']
const RETURN = 16
const HOLD = 36
const TOTAL = LINES.reduce((sum, line) => sum + line.length, 0)
const TYPE_FRAMES = LINES.reduce((sum, line, i) => sum + line.length * 2 + (i < LINES.length - 1 ? RETURN : 0), 0)
const CYCLE = TYPE_FRAMES + HOLD + TOTAL + 24

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.LEFT, p.CENTER)
    p.noStroke()
  }

  p.draw = () => {
    p.background(pal.bg)
    const phase = (p.frameCount - 1) % CYCLE
    let shown = TOTAL
    let caretLine = LINES.length - 1
    let caretCol = LINES[caretLine]!.length
    let returning = false
    let returnK = 0

    if (phase < TYPE_FRAMES) {
      shown = 0
      let clock = phase
      for (let i = 0; i < LINES.length; i++) {
        const line = LINES[i]!
        if (clock < line.length * 2) {
          caretLine = i
          caretCol = Math.floor(clock / 2)
          shown += caretCol
          break
        }
        shown += line.length
        clock -= line.length * 2
        if (i < LINES.length - 1 && clock < RETURN) {
          caretLine = i
          caretCol = line.length
          returning = true
          returnK = clock / RETURN
          break
        }
        if (i < LINES.length - 1) clock -= RETURN
      }
    } else if (phase >= TYPE_FRAMES + HOLD) {
      shown = Math.max(0, TOTAL - Math.floor(phase - TYPE_FRAMES - HOLD))
      caretLine = 0
      caretCol = 0
      let remaining = shown
      for (let i = 0; i < LINES.length; i++) {
        if (remaining <= LINES[i]!.length) {
          caretLine = i
          caretCol = remaining
          break
        }
        remaining -= LINES[i]!.length
      }
    }

    const left = p.width * 0.11
    const top = p.height * 0.31
    const lineH = p.height * 0.145
    p.textSize(p.width * 0.036)
    const advance = p.textWidth('M')
    let remaining = shown
    for (let i = 0; i < LINES.length; i++) {
      const count = Math.min(LINES[i]!.length, Math.max(0, remaining))
      const c = p.color(pal.signal)
      c.setAlpha(100 + (count > 0 ? 120 : 0))
      p.fill(c)
      p.text(LINES[i]!.slice(0, count), left, top + i * lineH)
      remaining -= LINES[i]!.length
    }

    let caretX = left + caretCol * advance
    let caretY = top + caretLine * lineH
    if (returning) {
      caretX = p.lerp(left + LINES[caretLine]!.length * advance, left, returnK)
      caretY = p.lerp(top + caretLine * lineH, top + (caretLine + 1) * lineH, returnK)
    }
    const caret = p.color(pal.accent)
    caret.setAlpha(150 + 105 * Math.sin(p.frameCount * 0.28) ** 2)
    p.fill(caret)
    p.rect(caretX, caretY - p.height * 0.026, p.width * 0.008, p.height * 0.052)

    const rail = p.color(pal.dim)
    rail.setAlpha(100)
    p.fill(rail)
    p.rect(left, p.height * 0.78, p.width * 0.78, 2)
    p.rect(left, p.height * 0.78, p.width * 0.78 * (phase / CYCLE), 3)
  }
}
