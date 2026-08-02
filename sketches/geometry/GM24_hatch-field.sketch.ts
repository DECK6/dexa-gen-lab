import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const GRID = 8
const PAD = 24

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const angles: number[] = []

  const clippedLine = (cx: number, cy: number, half: number, angle: number, offset: number) => {
    const bx = -p.sin(angle) * offset
    const by = p.cos(angle) * offset
    const vx = p.cos(angle)
    const vy = p.sin(angle)
    let low = -half * 3
    let high = half * 3
    const clip = (base: number, velocity: number) => {
      if (p.abs(velocity) < 0.0001) return p.abs(base) <= half
      const a = (-half - base) / velocity
      const b = (half - base) / velocity
      low = p.max(low, p.min(a, b))
      high = p.min(high, p.max(a, b))
      return low <= high
    }
    if (!clip(bx, vx) || !clip(by, vy)) return
    p.line(cx + bx + vx * low, cy + by + vy * low, cx + bx + vx * high, cy + by + vy * high)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < GRID * GRID; i++) angles.push(p.floor(p.random(8)) * p.PI / 8)
  }

  p.draw = () => {
    p.background(pal.bg)
    const cell = (p.width - PAD * 2) / GRID
    const t = p.frameCount * 0.014
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const i = row * GRID + col
        const swing = p.sin(t + col * 0.42 - row * 0.33)
        const angle = angles[i]! + swing * 0.72
        const hot = swing > 0.94 && (row + col) % 3 === 0
        const hatch = p.color(hot ? pal.accent : pal.signal)
        hatch.setAlpha(hot ? 185 : 82)
        p.stroke(hatch)
        p.strokeWeight(hot ? 1.45 : 1)
        const cx = PAD + (col + 0.5) * cell
        const cy = PAD + (row + 0.5) * cell
        for (let offset = -cell * 0.42; offset <= cell * 0.42; offset += cell / 7) {
          clippedLine(cx, cy, cell * 0.45, angle, offset)
        }
      }
    }

    const frame = p.color(pal.dim)
    frame.setAlpha(100)
    p.noFill()
    p.stroke(frame)
    p.strokeWeight(1)
    p.rect(PAD, PAD, p.width - PAD * 2, p.height - PAD * 2)
  }
}
