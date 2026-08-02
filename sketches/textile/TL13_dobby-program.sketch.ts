import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 16
const ROWS = 18
const PROGRAMS = 8

export function sketch(p: P5, ctx: SketchCtx): void {
  const cards: number[][] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let card = 0; card < PROGRAMS; card++) {
      const bits: number[] = []
      for (let col = 0; col < COLS; col++) bits.push(p.random() > 0.42 + (card % 3) * 0.08 ? 1 : 0)
      cards.push(bits)
    }
    p.rectMode(p.CENTER)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const cardTime = p.frameCount / 36
    const active = Math.floor(cardTime) % PROGRAMS
    const next = (active + 1) % PROGRAMS
    const raw = cardTime % 1
    const blend = raw * raw * (3 - 2 * raw)
    const cellW = p.width * 0.76 / COLS
    const cellH = p.height * 0.66 / ROWS
    const left = p.width * 0.12
    const top = p.height * 0.27

    const warp = p.color(ctx.palette.dim)
    warp.setAlpha(65)
    p.stroke(warp)
    p.strokeWeight(1)
    for (let col = 0; col <= COLS; col++) p.line(left + col * cellW, top, left + col * cellW, top + ROWS * cellH)

    p.noStroke()
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const index = (col + row * 3) % COLS
        const from = cards[active]![index]! ^ (row % 4 === 0 ? 1 : 0)
        const to = cards[next]![index]! ^ ((row + 1) % 4 === 0 ? 1 : 0)
        const lift = p.lerp(from, to, blend)
        const woven = p.color(lift > 0.5 ? ctx.palette.signal : ctx.palette.dim)
        woven.setAlpha(55 + lift * 175)
        p.fill(woven)
        p.rect(left + (col + 0.5) * cellW, top + (row + 0.5) * cellH, cellW * 0.78, cellH * 0.62)
      }
    }

    const tape = p.color(ctx.palette.paper)
    tape.setAlpha(28)
    p.fill(tape)
    p.rect(p.width / 2, p.height * 0.12, p.width * 0.82, p.height * 0.14)
    for (let col = 0; col < COLS; col++) {
      p.fill(cards[active]![col] ? ctx.palette.accent : ctx.palette.ink)
      p.circle(left + (col + 0.5) * cellW, p.height * 0.12, cards[active]![col] ? 9 : 4)
    }
    p.fill(ctx.palette.accent)
    p.rect(left + blend * COLS * cellW, p.height * 0.22, 3, 18)
  }
}
