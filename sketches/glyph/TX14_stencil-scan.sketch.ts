import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Buf = ReturnType<P5['createGraphics']>

const GRID = 80

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buffer: Buf | null = null
  const mask: boolean[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    buffer = p.createGraphics(GRID, GRID)
    buffer.pixelDensity(1)
    buffer.clear()
    buffer.noStroke()
    buffer.fill(pal.paper)
    buffer.textFont('JetBrains Mono, monospace')
    buffer.textAlign(p.CENTER, p.CENTER)
    buffer.textSize(25)
    buffer.text('DEXA', GRID * 0.5, GRID * 0.36)
    buffer.text('SCAN', GRID * 0.5, GRID * 0.67)
    buffer.loadPixels()
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const opaque = buffer.pixels[(y * GRID + x) * 4 + 3]! > 80
        mask.push(opaque && (x % 17 !== 8 || y % 7 > 1))
      }
    }
    p.noStroke()
  }

  p.draw = () => {
    if (!buffer) return
    p.background(pal.bg)
    const cell = p.width / GRID
    const scan = ((p.frameCount * 1.15) % (GRID + 24)) - 12
    const beam = p.color(pal.accent)
    beam.setAlpha(34)
    p.fill(beam)
    p.rect((scan - 4) * cell, 0, cell * 8, p.height)

    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        if (!mask[y * GRID + x]) continue
        const distance = Math.abs(x - scan)
        const energy = Math.exp(-distance * distance / 38)
        const c = p.color(distance < 1.3 ? pal.accent : energy > 0.08 ? pal.signal : pal.dim)
        c.setAlpha(42 + energy * 213)
        p.fill(c)
        const size = cell * (0.72 + energy * 0.3)
        p.rect((x + 0.5) * cell - size * 0.5, (y + 0.5) * cell - size * 0.5, size, size)
      }
    }

    const mark = p.color(pal.signal)
    mark.setAlpha(170)
    p.fill(mark)
    p.rect(p.width * 0.08, p.height * 0.91, p.width * 0.84, 1)
    p.fill(pal.accent)
    p.rect(p.constrain(scan / GRID, 0, 1) * p.width * 0.84 + p.width * 0.08, p.height * 0.9, 3, p.height * 0.025)
  }
}
