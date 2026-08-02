import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MAX_DEPTH = 4
const OFFSETS: [number, number][] = [[0, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0
  let signal!: P5.Color
  let accent!: P5.Color

  const square = (x: number, y: number, size: number, key: number) => {
    p.stroke(key % 113 === 0 ? accent : signal)
    p.strokeWeight(key % 113 === 0 ? 1.8 : 0.85)
    p.square(x - size / 2, y - size / 2, size)
  }

  const vicsek = (x: number, y: number, size: number, depth: number, fold: number, key: number) => {
    if (depth === MAX_DEPTH - 1) {
      for (let i = 0; i < OFFSETS.length; i++) {
        const [dx, dy] = OFFSETS[i]!
        const child = p.lerp(size, size / 3, fold)
        square(x + (dx * size * fold) / 3, y + (dy * size * fold) / 3, child, key * 5 + i)
      }
      return
    }
    for (let i = 0; i < OFFSETS.length; i++) {
      const [dx, dy] = OFFSETS[i]!
      vicsek(x + (dx * size) / 3, y + (dy * size) / 3, size / 3, depth + 1, fold, key * 5 + i)
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    signal = p.color(pal.signal)
    signal.setAlpha(155)
    accent = p.color(pal.accent)
    accent.setAlpha(220)
    p.noFill()
    p.rectMode(p.CORNER)
  }

  p.draw = () => {
    p.background(pal.bg)
    const fold = 0.5 - 0.5 * Math.cos(p.frameCount * 0.014 + phase)
    const size = Math.min(p.width, p.height) * 0.82
    p.push()
    p.translate(p.width / 2, p.height / 2)
    p.rotate(Math.sin(p.frameCount * 0.004 + phase) * 0.035)
    vicsek(0, 0, size, 0, fold, 1)
    p.pop()
  }
}
