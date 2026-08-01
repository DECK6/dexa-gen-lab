import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const CELLS = 19
const PAD = 22
const STEPS = 2
const HOLD_FRAMES = 130
const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let walls: number[] = []
  let seen: boolean[] = []
  let stack: number[] = []
  let phase: 'carve' | 'hold' | 'fade' = 'carve'
  let phaseFrame = 0
  let alpha = 1

  const reset = () => {
    walls = new Array(CELLS * CELLS).fill(0b1111)
    seen = new Array(CELLS * CELLS).fill(false)
    const start = p.floor(p.random(CELLS * CELLS))
    seen[start] = true
    stack = [start]
  }

  const step = () => {
    if (stack.length === 0) return
    const cur = stack[stack.length - 1]!
    const cx = cur % CELLS
    const cy = p.floor(cur / CELLS)
    const open: number[] = []
    for (let d = 0; d < 4; d++) {
      const nx = cx + DX[d]!
      const ny = cy + DY[d]!
      if (nx < 0 || ny < 0 || nx >= CELLS || ny >= CELLS) continue
      if (!seen[ny * CELLS + nx]) open.push(d)
    }
    if (open.length === 0) {
      stack.pop()
      return
    }
    const d = open[p.floor(p.random(open.length))]!
    const ni = (cy + DY[d]!) * CELLS + cx + DX[d]!
    walls[cur] = walls[cur]! & ~(1 << d)
    walls[ni] = walls[ni]! & ~(1 << ((d + 2) % 4))
    seen[ni] = true
    stack.push(ni)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    reset()
  }

  p.draw = () => {
    p.background(pal.bg)
    phaseFrame++
    const s = (p.width - PAD * 2) / CELLS

    if (phase === 'carve') {
      for (let k = 0; k < STEPS; k++) step()
      if (stack.length === 0) {
        phase = 'hold'
        phaseFrame = 0
      }
    } else if (phase === 'hold' && phaseFrame > HOLD_FRAMES) {
      phase = 'fade'
      phaseFrame = 0
    } else if (phase === 'fade') {
      alpha = p.max(0, 1 - phaseFrame / 40)
      if (alpha <= 0) {
        reset()
        alpha = 1
        phase = 'carve'
        phaseFrame = 0
      }
    }

    const line = p.color(pal.signal)
    line.setAlpha((155 + 35 * p.sin(p.frameCount * 0.045)) * alpha)
    const dot = p.color(pal.dim)
    dot.setAlpha(120 * alpha)
    // diagonal scan band — the finished maze keeps breathing
    const band = p.color(pal.signal)
    band.setAlpha(255 * alpha)
    const wave = ((p.frameCount * 0.16) % (CELLS * 2 + 8)) - 4

    p.strokeWeight(1.2)
    for (let i = 0; i < CELLS * CELLS; i++) {
      const cx = i % CELLS
      const cy = p.floor(i / CELLS)
      const x = PAD + cx * s
      const y = PAD + cy * s
      if (!seen[i]) {
        p.stroke(dot)
        p.point(x + s / 2, y + s / 2)
        continue
      }
      const w = walls[i]!
      p.stroke(p.abs(cx + cy - wave) < 1.6 ? band : line)
      if (w & 1) p.line(x, y, x + s, y)
      if (w & 8) p.line(x, y, x, y + s)
      const rightOpen = cx + 1 >= CELLS || !seen[i + 1]
      const downOpen = cy + 1 >= CELLS || !seen[i + CELLS]
      if (w & 2 && rightOpen) p.line(x + s, y, x + s, y + s)
      if (w & 4 && downOpen) p.line(x, y + s, x + s, y + s)
    }

    // backtracker trail + carving head
    const trail = p.color(pal.accent)
    trail.setAlpha(55 * alpha)
    p.noStroke()
    p.fill(trail)
    for (const i of stack) {
      p.rect(PAD + (i % CELLS) * s + s * 0.3, PAD + p.floor(i / CELLS) * s + s * 0.3, s * 0.4, s * 0.4)
    }
    if (stack.length > 0) {
      const head = stack[stack.length - 1]!
      const hot = p.color(pal.accent)
      hot.setAlpha(235 * alpha)
      p.fill(hot)
      p.rect(PAD + (head % CELLS) * s + s * 0.18, PAD + p.floor(head / CELLS) * s + s * 0.18, s * 0.64, s * 0.64)
    }
    p.noFill()
  }
}
