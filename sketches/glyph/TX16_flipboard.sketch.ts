import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 15
const ROWS = 4
const CYCLE = 90
const PAGES = [
  ['SEOUL    06:20', 'TOKYO    07:45', 'BERLIN   09:10', 'DEXA     ONTIME'],
  ['OSAKA    10:35', 'LONDON   12:05', 'TAIPEI   14:40', 'GATE     A-07  '],
  ['SIGNAL   16:12', 'GLYPH    18:30', 'MATRIX   21:15', 'STATUS   BOARD '],
]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    p.strokeWeight(1)
  }

  p.draw = () => {
    p.background(pal.bg)
    const frame = p.frameCount - 1
    const page = Math.floor(frame / CYCLE)
    const phase = frame % CYCLE
    const cw = p.width * 0.86 / COLS
    const ch = p.height * 0.125
    const left = p.width * 0.07
    const top = p.height * 0.24
    p.textSize(cw * 0.62)

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const delay = (row * COLS + col) * 0.95
        const local = phase - delay
        const q = p.constrain(local / 24, 0, 1)
        const from = PAGES[page % PAGES.length]![row]!.padEnd(COLS).charAt(col)
        const to = PAGES[(page + 1) % PAGES.length]![row]!.padEnd(COLS).charAt(col)
        const chNow = local < 0 || q < 0.5 ? from : to
        const flipping = local >= 0 && local < 24
        const scaleY = flipping ? Math.max(0.12, Math.abs(Math.cos(q * p.PI))) : 1
        const x = left + (col + 0.5) * cw
        const y = top + (row + 0.5) * ch

        p.fill(pal.ink)
        const edge = p.color(pal.dim)
        edge.setAlpha(75)
        p.stroke(edge)
        p.rect(x - cw * 0.46, y - ch * 0.43, cw * 0.92, ch * 0.86, cw * 0.05)
        p.line(x - cw * 0.43, y, x + cw * 0.43, y)
        p.noStroke()
        const glyph = p.color(flipping && q > 0.4 && q < 0.6 ? pal.accent : pal.signal)
        glyph.setAlpha(220)
        p.fill(glyph)
        p.push()
        p.translate(x, y)
        p.scale(1, scaleY)
        p.text(chNow, 0, 0)
        p.pop()
      }
    }

    const progress = p.color(pal.accent)
    progress.setAlpha(220)
    p.fill(progress)
    p.rect(left + p.width * 0.86 * (phase / CYCLE), p.height * 0.82, cw * 0.18, p.height * 0.016)
  }
}
