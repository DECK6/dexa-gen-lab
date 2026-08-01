import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const CAP = 560
const START = 8
const R_DIVIDE = 11
const FAST_UNTIL = 40
const CELL = 26

type Cell = { x: number; y: number; r: number; flash: number; ax: number; ay: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let cells: Cell[] = []
  let phase = 0
  let timer = 0
  let bound = 0

  const reset = () => {
    cells = []
    for (let i = 0; i < START; i++) {
      const a = p.random(p.TWO_PI)
      const d = p.random(bound * 0.45)
      const x = p.width / 2 + Math.cos(a) * d
      const y = p.height / 2 + Math.sin(a) * d
      cells.push({ x, y, r: p.random(6, 9.5), flash: 0, ax: 1, ay: 0 })
    }
    phase = 0
    timer = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    bound = Math.min(p.width, p.height) * 0.46
    reset()
  }

  // Fast early mitosis (~20 frames per generation), easing off once the colony is established.
  const divide = () => {
    const n = cells.length
    const rate = n < FAST_UNTIL ? 0.17 : 0.17 * Math.pow(FAST_UNTIL / n, 0.6)
    for (let i = n - 1; i >= 0; i--) {
      const c = cells[i]!
      c.r += rate
      if (c.flash > 0) c.flash--
      if (c.r < R_DIVIDE || cells.length >= CAP) continue
      const a = p.random(p.TWO_PI)
      const ax = Math.cos(a)
      const ay = Math.sin(a)
      const nr = (c.r / 1.42) * p.random(0.94, 1.06)
      const off = nr * 0.6
      const kid = (s: number) => ({ x: c.x + ax * off * s, y: c.y + ay * off * s, r: nr, flash: 26, ax, ay })
      cells[i] = kid(1)
      cells.push(kid(-1))
    }
  }

  const relax = () => {
    const grid = new Map<number, number[]>()
    for (let i = 0; i < cells.length; i++) {
      const k = Math.floor(cells[i]!.x / CELL) * 4096 + Math.floor(cells[i]!.y / CELL)
      const bin = grid.get(k)
      if (bin) bin.push(i)
      else grid.set(k, [i])
    }
    for (let i = 0; i < cells.length; i++) {
      const a = cells[i]!
      const cx = Math.floor(a.x / CELL)
      const cy = Math.floor(a.y / CELL)
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const bin = grid.get((cx + ox) * 4096 + (cy + oy))
          if (!bin) continue
          for (let bi = 0; bi < bin.length; bi++) {
            const j = bin[bi]!
            if (j <= i) continue
            const b = cells[j]!
            const dx = b.x - a.x
            const dy = b.y - a.y
            const d = Math.hypot(dx, dy) || 0.01
            const over = a.r + b.r - d
            if (over <= 0) continue
            const px = (dx / d) * over * 0.24
            const py = (dy / d) * over * 0.24
            a.x -= px
            a.y -= py
            b.x += px
            b.y += py
          }
        }
      }
    }
    for (const c of cells) {
      const dx = c.x - p.width / 2
      const dy = c.y - p.height / 2
      const d = Math.hypot(dx, dy) || 0.01
      const over = (d + c.r - bound) * 0.5
      if (over <= 0) continue
      c.x -= (dx / d) * over
      c.y -= (dy / d) * over
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(phase === 2 ? 28 : 44)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    if (phase === 2) {
      if (++timer > 80) reset()
      return
    }
    if (phase === 0) {
      divide()
      if (cells.length >= CAP) {
        phase = 1
        timer = 0
      }
    } else if (++timer > 150) {
      phase = 2
      timer = 0
    }
    relax()
    const membrane = p.color(pal.dim)
    membrane.setAlpha(55)
    p.noFill()
    p.stroke(membrane)
    p.strokeWeight(1)
    p.ellipse(p.width / 2, p.height / 2, bound * 2, bound * 2)

    const wall = p.color(pal.signal)
    const fresh = p.color(pal.accent)
    for (const c of cells) {
      const dividing = c.flash > 0
      const ink = dividing ? fresh : wall
      ink.setAlpha(dividing ? 110 + c.flash * 5 : 150)
      p.stroke(ink)
      p.strokeWeight(dividing ? 1.3 : 1)
      p.ellipse(c.x, c.y, c.r * 2, c.r * 2)
      if (c.flash > 12) p.line(c.x - c.ax * c.r, c.y - c.ay * c.r, c.x + c.ax * c.r, c.y + c.ay * c.r)
    }

    wall.setAlpha(170)
    p.noStroke()
    p.fill(wall)
    for (const c of cells) p.ellipse(c.x, c.y, 1.8, 1.8)
  }
}
