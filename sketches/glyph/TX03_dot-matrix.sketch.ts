import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Buf = ReturnType<P5['createGraphics']>

const COLS = 52
const ROWS = 32
const MSG = 'DEXA GEN LAB / GENERATIVE / '

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf: Buf | null = null
  let cell = 0
  let span = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    cell = p.width / COLS
    buf = p.createGraphics(COLS, ROWS)
    buf.pixelDensity(1)
    buf.textFont('JetBrains Mono, monospace')
    buf.textSize(ROWS * 0.62)
    buf.textAlign(p.LEFT, p.CENTER)
    buf.noStroke()
    span = buf.textWidth(MSG)
    p.noStroke()
  }

  p.draw = () => {
    const g = buf
    if (!g) return
    p.background(pal.bg)

    // marquee scrolls right-to-left inside the low-res board buffer
    const scroll = (p.frameCount * 0.55) % span
    g.background(0)
    g.fill(255)
    for (let k = -1; k <= 1; k++) {
      g.text(MSG, -scroll + k * span, ROWS * 0.5)
    }
    g.loadPixels()
    const px = g.pixels

    const t = p.frameCount * 0.055
    const lit = p.color(pal.signal)
    const idle = p.color(pal.dim)
    const crest = p.color(pal.accent)
    const top = (p.height - ROWS * cell) * 0.5

    for (let gy = 0; gy < ROWS; gy++) {
      for (let gx = 0; gx < COLS; gx++) {
        const on = px[(gy * COLS + gx) * 4]! > 110
        // wave sweeps the whole board, brightening idle dots as it passes
        const w = 0.5 + 0.5 * Math.sin(gx * 0.26 + gy * 0.11 - t)
        const pulse = Math.pow(w, 6)
        const x = (gx + 0.5) * cell
        const y = top + (gy + 0.5) * cell
        if (on) {
          const c = pulse > 0.82 ? crest : lit
          c.setAlpha(180 + 75 * pulse)
          p.fill(c)
          p.circle(x, y, cell * (0.62 + 0.2 * pulse))
        } else {
          idle.setAlpha(28 + 120 * pulse)
          p.fill(idle)
          p.circle(x, y, cell * (0.2 + 0.22 * pulse))
        }
      }
    }
  }
}
