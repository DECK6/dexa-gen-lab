import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SIZE = 12
const ENTRIES = [
  { x: 1, y: 5, word: 'GENERATIVE', dx: 1, dy: 0 },
  { x: 2, y: 4, word: 'DEXA', dx: 0, dy: 1 },
  { x: 7, y: 5, word: 'TYPE', dx: 0, dy: 1 },
  { x: 10, y: 2, word: 'CODE', dx: 0, dy: 1 },
  { x: 1, y: 7, word: 'LAB', dx: 1, dy: 0 },
  { x: 7, y: 7, word: 'PULSE', dx: 1, dy: 0 },
  { x: 0, y: 4, word: 'CODE', dx: 1, dy: 0 },
]

interface Cell {
  x: number
  y: number
  ch: string
  order: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const cells: Cell[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    for (const entry of ENTRIES) {
      for (let i = 0; i < entry.word.length; i++) {
        const x = entry.x + entry.dx * i
        const y = entry.y + entry.dy * i
        if (!cells.find((cell) => cell.x === x && cell.y === y)) {
          cells.push({ x, y, ch: entry.word.charAt(i), order: cells.length })
        }
      }
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const side = p.width * 0.76
    const unit = side / SIZE
    const left = (p.width - side) * 0.5
    const top = (p.height - side) * 0.5
    const board = p.color(pal.ink)
    board.setAlpha(210)
    p.noStroke()
    p.fill(board)
    p.rect(left, top, side, side)

    const grid = p.color(pal.dim)
    grid.setAlpha(34)
    p.stroke(grid)
    p.noFill()
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) p.rect(left + x * unit, top + y * unit, unit, unit)
    }

    const phase = (p.frameCount % 260) / 260
    const fill = phase < 0.52 ? phase / 0.52 : 1 - (phase - 0.52) / 0.48
    const head = fill * (cells.length + 3)
    p.textSize(unit * 0.55)
    for (const cell of cells) {
      const visible = cell.order < head
      const frontier = Math.abs(cell.order - head) < 2.2
      const edge = p.color(frontier ? pal.accent : pal.signal)
      edge.setAlpha(visible ? 190 : 48)
      p.stroke(edge)
      p.fill(pal.ink)
      const x = left + cell.x * unit
      const y = top + cell.y * unit
      p.rect(x + 1, y + 1, unit - 2, unit - 2)
      if (visible) {
        p.noStroke()
        p.fill(frontier ? pal.accent : pal.signal)
        p.text(cell.ch, x + unit * 0.5, y + unit * 0.53)
      }
    }
  }
}
