import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 3
const WARM = 250
const PLOT = 240
// full run, then progressively tighter zooms into the period windows
const WINDOWS = [
  [2.9, 4],
  [3.4, 3.62],
  [3.55, 3.6],
  [3.82, 3.858],
  [3.735, 3.747],
]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let col = 0
  let lo = 2.9
  let hi = 4

  const nextWindow = () => {
    const w = WINDOWS[Math.floor(p.random(WINDOWS.length))]
    lo = w[0]
    hi = w[1]
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    p.strokeWeight(1)
    nextWindow()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(2)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cyan = p.color(pal.signal)
    cyan.setAlpha(28)
    p.stroke(cyan)
    const top = p.height * 0.06
    const usable = p.height * 0.88

    for (let c = 0; c < COLS; c++) {
      const r = lo + (hi - lo) * (col / p.width)
      let x = 0.5
      for (let i = 0; i < WARM; i++) x = r * x * (1 - x)
      for (let i = 0; i < PLOT; i++) {
        x = r * x * (1 - x)
        p.point(col, top + usable * (1 - x))
      }
      col++
      if (col > p.width) {
        col = 0
        nextWindow()
        break
      }
    }

    const scan = p.color(pal.accent)
    scan.setAlpha(34)
    p.stroke(scan)
    p.line(col, 0, col, p.height)
    const tip = p.color(pal.accent)
    tip.setAlpha(150)
    p.stroke(tip)
    p.line(col, p.height * 0.955, col, p.height)
  }
}
