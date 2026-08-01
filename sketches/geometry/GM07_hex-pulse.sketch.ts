import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 11
const SOURCES = 3
const RING_WIDTH = 46

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const cells: { x: number; y: number }[] = []
  const src: { x: number; y: number; speed: number; phase: number }[] = []
  let size = 0

  const hex = (x: number, y: number, r: number) => {
    p.beginShape()
    for (let i = 0; i < 6; i++) {
      const a = p.PI / 6 + (i * p.PI) / 3
      p.vertex(x + p.cos(a) * r, y + p.sin(a) * r)
    }
    p.endShape(p.CLOSE)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    size = p.width / ((COLS + 0.5) * p.sqrt(3))
    const hs = p.sqrt(3) * size
    const vs = 1.5 * size
    const rows = p.ceil(p.height / vs) + 1
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < COLS; c++) {
        cells.push({ x: hs * (c + (r % 2 ? 1 : 0.5)), y: vs * r + size * 0.5 })
      }
    }
    for (let i = 0; i < SOURCES; i++) {
      src.push({
        x: p.random(p.width * 0.15, p.width * 0.85),
        y: p.random(p.height * 0.15, p.height * 0.85),
        speed: p.random(1.5, 2.6),
        phase: p.random(1000),
      })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const span = p.width * 1.15

    for (const cell of cells) {
      let amp = 0
      for (const s of src) {
        const front = (p.frameCount * s.speed + s.phase) % span
        const d = p.dist(cell.x, cell.y, s.x, s.y)
        const gap = d - front
        amp += p.exp((-gap * gap) / (2 * RING_WIDTH * RING_WIDTH))
      }
      amp = p.min(amp, 1.4)

      const base = p.color(pal.dim)
      base.setAlpha(52)
      p.stroke(base)
      p.strokeWeight(1)
      hex(cell.x, cell.y, size * 0.82)

      if (amp < 0.05) continue
      const hot = amp > 0.78
      const wave = p.color(hot ? pal.accent : pal.signal)
      wave.setAlpha(p.min(235, 60 + amp * 210))
      p.stroke(wave)
      p.strokeWeight(hot ? 1.7 : 1.15)
      hex(cell.x, cell.y, size * (0.5 + amp * 0.42))

      if (hot) {
        p.strokeWeight(2.4)
        p.point(cell.x, cell.y)
      }
    }
  }
}
