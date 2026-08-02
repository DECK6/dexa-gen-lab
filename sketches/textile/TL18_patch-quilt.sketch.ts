import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 6
const ROWS = 6

export function sketch(p: P5, ctx: SketchCtx): void {
  const drawPatch = (x: number, y: number, size: number, kind: number, alpha: number) => {
    const field = p.color(ctx.palette.signal)
    const thread = p.color(kind === 3 ? ctx.palette.paper : ctx.palette.signal)
    field.setAlpha(alpha * 0.22)
    thread.setAlpha(alpha)
    p.noStroke()
    p.fill(field)
    p.rect(x + 3, y + 3, size - 6, size - 6)
    p.noFill()
    p.stroke(thread)
    p.strokeWeight(1.4)
    if (kind === 0) {
      for (let offset = -size; offset < size * 2; offset += 14) p.line(x + offset, y, x + offset + size, y + size)
    } else if (kind === 1) {
      p.quad(x + size / 2, y + 8, x + size - 8, y + size / 2, x + size / 2, y + size - 8, x + 8, y + size / 2)
      p.circle(x + size / 2, y + size / 2, size * 0.34)
    } else if (kind === 2) {
      p.line(x + 8, y + size / 2, x + size - 8, y + size / 2)
      p.line(x + size / 2, y + 8, x + size / 2, y + size - 8)
      p.circle(x + size / 2, y + size / 2, size * 0.5)
    } else {
      p.triangle(x + 7, y + 7, x + size - 7, y + 7, x + 7, y + size - 7)
      p.triangle(x + size - 7, y + size - 7, x + size - 7, y + 7, x + 7, y + size - 7)
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const margin = p.width * 0.08
    const size = (p.width - margin * 2) / COLS
    const step = Math.floor((p.frameCount - 1) / 48)
    const active = step % (COLS * ROWS)
    const phase = ((p.frameCount - 1) % 48) / 48
    const era = Math.floor(step / (COLS * ROWS))

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const index = row * COLS + col
        const generation = era + (index < active ? 1 : 0)
        const kind = (col * 3 + row * 5 + generation * 7) % 4
        const x = margin + col * size
        const y = margin + row * size
        drawPatch(x, y, size, kind, 150)
        if (index === active) drawPatch(x, y, size, (kind + 3) % 4, 210 * phase)
      }
    }

    const activeX = margin + (active % COLS) * size
    const activeY = margin + Math.floor(active / COLS) * size
    const perimeter = phase * size * 4
    let needleX = activeX
    let needleY = activeY
    if (perimeter < size) needleX += perimeter
    else if (perimeter < size * 2) {
      needleX += size
      needleY += perimeter - size
    } else if (perimeter < size * 3) {
      needleX += size * 3 - perimeter
      needleY += size
    } else needleY += size * 4 - perimeter
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(needleX, needleY, 8)
  }
}
