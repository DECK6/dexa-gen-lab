import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 48
const ROWS = 32

export function sketch(p: P5, ctx: SketchCtx): void {
  const phosphor = new Float32Array(COLS * ROWS)
  const target = (col: number, row: number): boolean => {
    const x = (col + 0.5) / COLS * 2 - 1
    const y = (row + 0.5) / ROWS * 2 - 1
    const eye = Math.abs(Math.sqrt(x * x * 1.35 + y * y * 4.1) - 0.72) < 0.055
    const pupil = x * x + y * y < 0.025
    const trace = Math.abs(y - Math.sin(x * 8.2) * 0.12) < 0.045 && Math.abs(x) < 0.78
    return eye || pupil || trace
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.strokeCap(p.SQUARE)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const scanRow = Math.floor((p.frameCount * 0.72) % ROWS)
    for (let i = 0; i < phosphor.length; i++) phosphor[i] *= 0.942
    for (let col = 0; col < COLS; col++) {
      const index = scanRow * COLS + col
      phosphor[index] = Math.max(phosphor[index], target(col, scanRow) ? 1 : 0.09)
    }

    const left = ctx.width * 0.08
    const top = ctx.height * 0.12
    const cellWidth = ctx.width * 0.84 / COLS
    const cellHeight = ctx.height * 0.76 / ROWS
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const glow = phosphor[row * COLS + col]
        if (glow < 0.018) continue
        const color = p.color(ctx.palette.signal)
        color.setAlpha(18 + glow * 225)
        p.stroke(color)
        p.strokeWeight(1 + glow * 2.5)
        const x = left + col * cellWidth
        const y = top + row * cellHeight
        p.line(x, y, x + cellWidth * 0.72, y)
      }
    }

    const scanner = p.color(ctx.palette.accent)
    scanner.setAlpha(205)
    p.stroke(scanner)
    p.strokeWeight(1.5)
    const scanY = top + scanRow * cellHeight
    p.line(left - 8, scanY, left + COLS * cellWidth + 8, scanY)
    p.noFill()
    p.stroke(ctx.palette.dim)
    p.rect(left - 12, top - 12, COLS * cellWidth + 24, ROWS * cellHeight + 24)
  }
}
