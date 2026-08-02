import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 9
const ROWS = 9
const CYCLE = 330

type Tip = { col: number; row: number; dc: number; dr: number; id: number }
type Seg = { c1: number; r1: number; c2: number; r2: number; id: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let tips: Tip[] = []
  let segs: Seg[] = []
  let used = new Set<string>()
  let visits = new Uint8Array(COLS * ROWS)
  let age = 0

  const reset = () => {
    tips = []
    segs = []
    used = new Set()
    visits = new Uint8Array(COLS * ROWS)
    for (let i = 0; i < 7; i++) {
      const col = Math.floor(p.random(COLS))
      tips.push({ col, row: ROWS - 1, dc: 0, dr: -1, id: i })
      visits[(ROWS - 1) * COLS + col]++
    }
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    reset()
  }

  const edgeKey = (c1: number, r1: number, c2: number, r2: number) => {
    const a = r1 * COLS + c1
    const b = r2 * COLS + c2
    return a < b ? `${a}-${b}` : `${b}-${a}`
  }

  const grow = () => {
    for (let i = tips.length - 1; i >= 0; i--) {
      const q = tips[i]!
      const dirs = [[0, -1], [-1, 0], [1, 0], [0, 1]]
      let choice: number[] | undefined
      let best = -Infinity
      for (const d of dirs) {
        const nc = q.col + d[0]!
        const nr = q.row + d[1]!
        if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS || (d[0] === -q.dc && d[1] === -q.dr)) continue
        const key = edgeKey(q.col, q.row, nc, nr)
        const score = p.noise(q.id * 2.7, nc * 0.31, nr * 0.29 + age * 0.006) + (d[1] === -1 ? 0.34 : 0) + (used.has(key) ? -0.65 : 0) + visits[nr * COLS + nc]! * 0.05
        if (score > best) {
          best = score
          choice = d
        }
      }
      if (!choice) {
        tips.splice(i, 1)
        continue
      }
      const nc = q.col + choice[0]!
      const nr = q.row + choice[1]!
      used.add(edgeKey(q.col, q.row, nc, nr))
      segs.push({ c1: q.col, r1: q.row, c2: nc, r2: nr, id: q.id })
      q.col = nc
      q.row = nr
      q.dc = choice[0]!
      q.dr = choice[1]!
      visits[nr * COLS + nc]++
      if (tips.length < 18 && p.random() < 0.055) tips.push({ col: nc, row: nr, dc: -q.dr, dr: q.dc, id: q.id })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    age++
    if (age >= CYCLE) reset()
    if (age < 220 && age % 2 === 0) grow()
    const fade = age > 280 ? 1 - (age - 280) / 50 : 1
    const pad = p.width * 0.1
    const sx = (p.width - pad * 2) / (COLS - 1)
    const sy = (p.height - pad * 2) / (ROWS - 1)
    const grid = p.color(pal.dim)
    grid.setAlpha(55 * fade)
    p.stroke(grid)
    p.strokeWeight(1)
    for (let i = 0; i < COLS; i++) p.line(pad + i * sx, pad, pad + i * sx, p.height - pad)
    for (let i = 0; i < ROWS; i++) p.line(pad, pad + i * sy, p.width - pad, pad + i * sy)
    const vine = p.color(pal.signal)
    const knot = p.color(pal.accent)
    for (const s of segs) {
      const x1 = pad + s.c1 * sx
      const y1 = pad + s.r1 * sy
      const x2 = pad + s.c2 * sx
      const y2 = pad + s.r2 * sy
      const bend = Math.sin(s.id * 2.1 + p.frameCount * 0.025) * 4
      vine.setAlpha(125 * fade)
      p.stroke(vine)
      p.strokeWeight(1.5)
      p.beginShape()
      p.vertex(x1, y1)
      p.vertex((x1 + x2) / 2 + (y2 - y1 === 0 ? 0 : bend), (y1 + y2) / 2 + (x2 - x1 === 0 ? 0 : bend))
      p.vertex(x2, y2)
      p.endShape()
    }
    knot.setAlpha(210 * fade)
    p.noStroke()
    p.fill(knot)
    for (let i = 0; i < visits.length; i++) if (visits[i]! > 2) p.ellipse(pad + (i % COLS) * sx, pad + Math.floor(i / COLS) * sy, Math.min(8, visits[i]! + 2))
  }
}
