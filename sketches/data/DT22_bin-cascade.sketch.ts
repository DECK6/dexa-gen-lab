import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Ball {
  row: number
  index: number
  progress: number
  direction: number
  speed: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const rows = 11
  const bins = Array<number>(rows + 1).fill(0)
  const balls: Ball[] = []

  const spawn = (row = 0): void => {
    let index = 0
    for (let i = 0; i < row; i++) if (p.random() < 0.5) index++
    balls.push({ row, index, progress: p.random(), direction: p.random() < 0.5 ? 0 : 1, speed: p.random(0.18, 0.29) })
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 120; i++) spawn(Math.floor(p.random(rows)))
  }

  p.draw = () => {
    p.background(pal.bg)
    const cx = ctx.width / 2
    const top = 48
    const spacing = Math.min(ctx.width, ctx.height) * 0.046
    const rowGap = ctx.height * 0.052
    for (let i = 0; i < 6; i++) spawn()
    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i]
      ball.progress += ball.speed
      if (ball.progress < 1) continue
      ball.progress -= 1
      ball.row++
      ball.index += ball.direction
      if (ball.row >= rows) {
        bins[ball.index]++
        balls[i] = balls[balls.length - 1]
        balls.pop()
      } else ball.direction = p.random() < 0.5 ? 0 : 1
    }
    if (bins.reduce((sum, value) => sum + value, 0) > 1200) bins.fill(0)
    const pin = p.color(pal.dim)
    pin.setAlpha(170)
    p.noStroke()
    p.fill(pin)
    for (let row = 0; row < rows; row++) {
      for (let index = 0; index <= row; index++) {
        p.circle(cx + (index - row / 2) * spacing, top + row * rowGap, 5)
      }
    }
    p.fill(pal.signal)
    for (const ball of balls) {
      const x1 = cx + (ball.index - ball.row / 2) * spacing
      const x2 = cx + (ball.index + ball.direction - (ball.row + 1) / 2) * spacing
      const y1 = top + ball.row * rowGap
      p.circle(p.lerp(x1, x2, ball.progress), y1 + ball.progress * rowGap, 6)
    }
    const base = ctx.height - 38
    const maxBin = Math.max(1, ...bins)
    const binW = spacing * 0.9
    for (let i = 0; i < bins.length; i++) {
      const h = bins[i] / maxBin * ctx.height * 0.22
      p.fill(i === Math.floor(bins.length / 2) ? pal.accent : pal.signal)
      p.rect(cx + (i - rows / 2) * spacing - binW / 2, base - h, binW, h)
    }
    p.stroke(pal.paper)
    p.strokeWeight(1)
    p.line(cx - (rows + 1) * spacing / 2, base, cx + (rows + 1) * spacing / 2, base)
  }
}
