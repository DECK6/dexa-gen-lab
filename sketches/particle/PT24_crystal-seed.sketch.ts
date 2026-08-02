import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SIDE = 31
const HALF = SIDE >> 1

interface Mote {
  sx: number
  sy: number
  tx: number
  ty: number
  cell: number
  age: number
  life: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const grid = new Uint8Array(SIDE * SIDE)
  const motes: Mote[] = []
  let gap = 0
  let placed = 0

  const restart = () => {
    grid.fill(0)
    grid[HALF * SIDE + HALF] = 1
    motes.length = 0
    placed = 1
    p.background(pal.bg)
  }

  const launch = () => {
    const frontier: number[] = []
    for (let r = 1; r < SIDE - 1; r++) {
      for (let c = 1; c < SIDE - 1; c++) {
        const i = r * SIDE + c
        if (grid[i] !== 0) continue
        if (grid[i - 1] === 1 || grid[i + 1] === 1 || grid[i - SIDE] === 1 || grid[i + SIDE] === 1) frontier.push(i)
      }
    }
    if (frontier.length === 0) return
    const cell = frontier[Math.floor(p.random(frontier.length))]
    grid[cell] = 2
    const c = cell % SIDE
    const r = Math.floor(cell / SIDE)
    const tx = p.width / 2 + (c - HALF) * gap
    const ty = p.height / 2 + (r - HALF) * gap
    const a = p.random(p.TWO_PI)
    const radius = p.width * 0.48
    motes.push({ sx: p.width / 2 + Math.cos(a) * radius, sy: p.height / 2 + Math.sin(a) * radius, tx, ty, cell, age: 0, life: p.random(18, 34) })
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    gap = p.width * 0.026
    restart()
  }

  p.draw = () => {
    if (placed > 520 || p.frameCount % 720 === 0) restart()
    const veil = p.color(pal.bg)
    veil.setAlpha(26)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    const launches = p.frameCount < 100 ? 4 : 2
    for (let i = 0; i < launches; i++) launch()

    const cyan = p.color(pal.signal)
    cyan.setAlpha(185)
    const orange = p.color(pal.accent)
    orange.setAlpha(210)
    p.strokeWeight(1)
    for (let i = motes.length - 1; i >= 0; i--) {
      const o = motes[i]
      const k = Math.min(o.age / o.life, 1)
      const eased = 1 - (1 - k) * (1 - k)
      const x = p.lerp(o.sx, o.tx, eased)
      const y = p.lerp(o.sy, o.ty, eased)
      p.stroke(orange)
      p.line(x, y, o.tx, o.ty)
      o.age++
      if (k < 1) continue
      grid[o.cell] = 1
      placed++
      motes.splice(i, 1)
    }

    p.stroke(cyan)
    p.strokeWeight(2)
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] !== 1) continue
      const c = i % SIDE
      const r = Math.floor(i / SIDE)
      const x = p.width / 2 + (c - HALF) * gap
      const y = p.height / 2 + (r - HALF) * gap
      p.point(x, y)
      p.strokeWeight(1)
      if (c + 1 < SIDE && grid[i + 1] === 1) p.line(x, y, x + gap, y)
      if (r + 1 < SIDE && grid[i + SIDE] === 1) p.line(x, y, x, y + gap)
      p.strokeWeight(2)
    }
  }
}
