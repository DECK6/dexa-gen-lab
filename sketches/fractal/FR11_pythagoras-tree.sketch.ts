import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MAX_DEPTH = 8

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0
  let signal!: P5.Color
  let dim!: P5.Color
  let accent!: P5.Color

  const box = (ax: number, ay: number, bx: number, by: number, depth: number, theta: number) => {
    const vx = bx - ax
    const vy = by - ay
    const size = Math.hypot(vx, vy)
    const ux = vx / size
    const uy = vy / size
    const nx = uy
    const ny = -ux
    const cx = bx + nx * size
    const cy = by + ny * size
    const dx = ax + nx * size
    const dy = ay + ny * size

    p.stroke(depth === 0 ? dim : signal)
    p.strokeWeight(Math.max(0.55, 2.2 - depth * 0.2))
    p.beginShape()
    p.vertex(ax, ay)
    p.vertex(bx, by)
    p.vertex(cx, cy)
    p.vertex(dx, dy)
    p.endShape(p.CLOSE)
    if (depth === 2) {
      p.stroke(accent)
      p.point(dx, dy)
    }
    if (depth >= MAX_DEPTH) return

    const co = Math.cos(theta)
    const si = Math.sin(theta)
    const ex = dx + ux * size * co * co + nx * size * co * si
    const ey = dy + uy * size * co * co + ny * size * co * si
    box(dx, dy, ex, ey, depth + 1, theta)
    box(ex, ey, cx, cy, depth + 1, theta)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    signal = p.color(pal.signal)
    signal.setAlpha(150)
    dim = p.color(pal.dim)
    dim.setAlpha(190)
    accent = p.color(pal.accent)
    accent.setAlpha(220)
    p.noFill()
  }

  p.draw = () => {
    p.background(pal.bg)
    const size = Math.min(p.width, p.height) * 0.155
    const lean = 0.58 + 0.16 * Math.sin(p.frameCount * 0.011 + phase)
    const sway = Math.sin(p.frameCount * 0.006 + phase) * 0.035
    const cx = p.width / 2
    const y = p.height * 0.91
    const dx = Math.cos(sway) * size * 0.5
    const dy = Math.sin(sway) * size * 0.5
    box(cx - dx, y - dy, cx + dx, y + dy, 0, lean)
  }
}
