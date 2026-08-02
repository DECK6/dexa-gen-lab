import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 28
const ROWS = 15
const COUNT = 54
const SOURCE = 'DEXA GEN LAB / EDIT SIGNAL / GLYPH MATRIX / '
const REPLACE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_'

interface Caret {
  x: number
  y: number
  tx: number
  ty: number
  speed: number
  turn: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const chars: string[] = []
  const age: number[] = []
  const carets: Caret[] = []

  const route = (caret: Caret, index: number) => {
    caret.turn++
    const a = caret.turn * 0.91 + index * 0.37 + ctx.seed * 0.01
    caret.tx = p.constrain(Math.round(COLS * 0.5 + Math.sin(a) * COLS * 0.34 + index % 5 - 2), 0, COLS - 1)
    caret.ty = p.constrain(Math.round(ROWS * 0.5 + Math.cos(a * 1.31) * ROWS * 0.34), 0, ROWS - 1)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    for (let i = 0; i < COLS * ROWS; i++) {
      chars.push(SOURCE.charAt((i + Math.floor(i / COLS) * 7) % SOURCE.length))
      age.push(99)
    }
    for (let i = 0; i < COUNT; i++) {
      const caret = { x: p.random(COLS), y: p.random(ROWS), tx: 0, ty: 0, speed: p.random(0.16, 0.34), turn: i % 7 }
      route(caret, i)
      carets.push(caret)
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const left = p.width * 0.07
    const top = p.height * 0.12
    const cw = p.width * 0.86 / COLS
    const ch = p.height * 0.76 / ROWS
    for (let i = 0; i < age.length; i++) age[i]++

    for (let i = 0; i < carets.length; i++) {
      const caret = carets[i]!
      if (Math.abs(caret.x - caret.tx) > 0.04) {
        caret.x += Math.sign(caret.tx - caret.x) * Math.min(caret.speed, Math.abs(caret.tx - caret.x))
      } else if (Math.abs(caret.y - caret.ty) > 0.04) {
        caret.y += Math.sign(caret.ty - caret.y) * Math.min(caret.speed, Math.abs(caret.ty - caret.y))
      } else {
        const cell = caret.ty * COLS + caret.tx
        chars[cell] = REPLACE.charAt((caret.turn * 7 + i * 3 + ctx.seed) % REPLACE.length)
        age[cell] = 0
        route(caret, i)
      }
    }

    p.noStroke()
    p.textSize(cw * 0.76)
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const i = y * COLS + x
        const fresh = p.constrain(1 - age[i]! / 45, 0, 1)
        const c = p.color(fresh > 0.55 ? pal.accent : fresh > 0 ? pal.signal : pal.dim)
        c.setAlpha(70 + fresh * 185)
        p.fill(c)
        p.text(chars[i]!, left + (x + 0.5) * cw, top + (y + 0.5) * ch)
      }
    }

    p.strokeWeight(Math.max(1, p.width * 0.002))
    for (let i = 0; i < carets.length; i++) {
      const caret = carets[i]!
      const c = p.color(i % 13 === 0 ? pal.accent : pal.signal)
      c.setAlpha(i % 13 === 0 ? 235 : 145)
      p.stroke(c)
      const x = left + (caret.x + 0.12) * cw
      const y = top + (caret.y + 0.5) * ch
      p.line(x, y - ch * 0.42, x, y + ch * 0.42)
      p.line(x, y + ch * 0.42, x + cw * 0.25, y + ch * 0.42)
    }
  }
}
