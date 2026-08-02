import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const START = 300
const CAP = 2200
const CYCLE = 420

type Plankton = { x: number; y: number; age: number; life: number; phase: number; hot: boolean }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let cells: Plankton[] = []
  let season = 0

  const born = (x: number, y: number): Plankton => ({ x, y, age: 0, life: p.random(190, 310), phase: p.random(p.TWO_PI), hot: p.random() < 0.025 })

  const reset = () => {
    cells = []
    for (let i = 0; i < START; i++) cells.push(born(p.random(p.width), p.random(p.height)))
    season = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    reset()
  }

  const velocity = (x: number, y: number, time: number) => {
    let vx = 0.12
    let vy = 0
    for (let i = 0; i < 2; i++) {
      const a = time * (i === 0 ? 0.7 : -0.5) + i * p.PI
      const cx = p.width / 2 + Math.cos(a) * p.width * 0.2
      const cy = p.height / 2 + Math.sin(a * 0.8) * p.height * 0.2
      const dx = x - cx
      const dy = y - cy
      const force = (i === 0 ? 1 : -1) * 36 / (Math.hypot(dx, dy) + 45)
      vx += -dy * force * 0.018
      vy += dx * force * 0.018
    }
    return { vx, vy }
  }

  p.draw = () => {
    p.background(pal.bg)
    season++
    if (season >= CYCLE) reset()
    const time = p.frameCount * 0.006
    for (let i = cells.length - 1; i >= 0; i--) {
      const q = cells[i]!
      const v = velocity(q.x, q.y, time)
      q.x += v.vx + (p.noise(q.phase, time) - 0.5) * 0.35
      q.y += v.vy + (p.noise(q.phase + 20, time) - 0.5) * 0.35
      q.age += season > 190 ? 2.8 : 1
      if (q.x < -8) q.x = p.width + 8
      if (q.x > p.width + 8) q.x = -8
      if (q.y < -8) q.y = p.height + 8
      if (q.y > p.height + 8) q.y = -8
      if (q.age > q.life) cells.splice(i, 1)
    }
    if (season > 210 && cells.length < START * 0.1) reset()
    if (season < 175 && cells.length < CAP) {
      const births = Math.min(42, 5 + Math.floor(cells.length * 0.014))
      for (let i = 0; i < births && cells.length < CAP; i++) {
        const parent = cells[Math.floor(p.random(cells.length))]!
        const nutrient = p.noise(parent.x * 0.006, parent.y * 0.006, season * 0.008)
        if (nutrient > 0.39) cells.push(born(parent.x + p.random(-5, 5), parent.y + p.random(-5, 5)))
      }
    }
    const cell = p.color(pal.signal)
    const hot = p.color(pal.accent)
    for (const q of cells) {
      const col = q.hot ? hot : cell
      const fade = Math.sin(Math.min(1, q.age / q.life) * p.PI)
      col.setAlpha((q.hot ? 220 : 70 + fade * 120))
      p.stroke(col)
      p.strokeWeight(0.7)
      const pulse = 1.5 + Math.sin(p.frameCount * 0.08 + q.phase) * 0.5
      p.line(q.x, q.y, q.x - Math.cos(q.phase + time) * 3, q.y - Math.sin(q.phase + time) * 3)
      p.noFill()
      p.ellipse(q.x, q.y, pulse)
    }
  }
}
