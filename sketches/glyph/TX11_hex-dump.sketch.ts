import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 8
const ROWS = 18

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const memory: number[] = []
  const age: number[] = []
  let lastTick = -1

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.LEFT, p.CENTER)
    p.noStroke()
    for (let i = 0; i < COLS * ROWS; i++) {
      memory.push(Math.floor(p.random(256)))
      age.push(99)
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const tick = Math.floor(p.frameCount / 3)
    if (tick !== lastTick) {
      for (let i = 0; i < age.length; i++) age[i]++
      const center = (tick * 37 + ctx.seed * 11) % memory.length
      const cx = center % COLS
      const cy = Math.floor(center / COLS)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const x = cx + dx
          const y = cy + dy
          if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue
          const i = y * COLS + x
          memory[i] = (memory[i]! + 31 + dx * 13 + dy * 19 + tick) & 255
          age[i] = 0
        }
      }
      lastTick = tick
    }

    const left = p.width * 0.08
    const top = p.height * 0.14
    const rowH = p.height * 0.043
    const byteLeft = p.width * 0.31
    const byteW = p.width * 0.073
    const label = p.color(pal.dim)
    label.setAlpha(150)
    p.fill(label)
    p.textSize(p.width * 0.021)
    p.text('OFFSET', left, top - rowH * 1.35)
    p.text('00  01  02  03  04  05  06  07', byteLeft, top - rowH * 1.35)

    for (let row = 0; row < ROWS; row++) {
      const y = top + row * rowH
      label.setAlpha(80 + (row % 4 === 0 ? 65 : 0))
      p.fill(label)
      p.text((row * COLS).toString(16).padStart(4, '0').toUpperCase(), left, y)
      for (let col = 0; col < COLS; col++) {
        const i = row * COLS + col
        const fresh = p.constrain(1 - age[i]! / 8, 0, 1)
        const c = p.color(fresh > 0.62 ? pal.accent : pal.signal)
        c.setAlpha(72 + fresh * 183)
        p.fill(c)
        p.text(memory[i]!.toString(16).padStart(2, '0').toUpperCase(), byteLeft + col * byteW, y)
      }
    }

    const scan = p.color(pal.accent)
    scan.setAlpha(180)
    p.fill(scan)
    p.rect(left, p.height * 0.935, p.width * (0.08 + 0.2 * Math.sin(p.frameCount * 0.04) ** 2), 2)
  }
}
