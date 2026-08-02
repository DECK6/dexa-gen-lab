import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const GRID = 12
const PAD = 24

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.rectMode(p.CENTER)
    phase = p.random(4)
  }

  p.draw = () => {
    p.background(pal.bg)
    const cell = (p.width - PAD * 2) / GRID

    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const wave = p.frameCount / 18 - (row + col) * 0.42 + phase
        const cycle = p.floor(wave)
        const local = wave - cycle
        const turn = p.min(1, local / 0.34)
        const eased = turn * turn * (3 - 2 * turn)
        const scale = p.cos((cycle + eased) * p.PI)
        const flipping = local < 0.34
        const line = p.color(flipping ? pal.accent : pal.signal)
        line.setAlpha(flipping ? 225 : 90 + ((cycle % 2 + 2) % 2) * 55)

        p.push()
        p.translate(PAD + (col + 0.5) * cell, PAD + (row + 0.5) * cell)
        p.scale(scale, 1)
        p.fill(pal.ink)
        p.stroke(line)
        p.strokeWeight(flipping ? 1.6 : 1)
        p.rect(0, 0, cell * 0.78, cell * 0.78)
        const diagonal = (cycle + row + col) % 2 === 0 ? 1 : -1
        p.line(-cell * 0.28, diagonal * cell * 0.28, cell * 0.28, -diagonal * cell * 0.28)
        p.pop()
      }
    }
  }
}
