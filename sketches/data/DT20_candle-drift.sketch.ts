import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Candle {
  open: number
  high: number
  low: number
  close: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const candles: Candle[] = []
  const count = 46
  let index = 0

  const nextCandle = (previous: number): Candle => {
    const open = previous
    const close = open + p.random(-4.2, 4.2) + (100 - open) * 0.035 + Math.sin(index++ * 0.31) * 0.7
    return { open, close, high: Math.max(open, close) + p.random(0.8, 3.4), low: Math.min(open, close) - p.random(0.8, 3.4) }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    let close = 100
    for (let i = 0; i < count; i++) {
      const candle = nextCandle(close)
      candles.push(candle)
      close = candle.close
    }
  }

  p.draw = () => {
    if (p.frameCount % 9 === 0) {
      candles.shift()
      candles.push(nextCandle(candles[candles.length - 1].close))
    }
    const current = candles[candles.length - 1]
    current.close += Math.sin(p.frameCount * 0.13) * 0.055 + (p.noise(p.frameCount * 0.04) - 0.5) * 0.04
    current.high = Math.max(current.high, current.close)
    current.low = Math.min(current.low, current.close)
    p.background(pal.bg)
    const margin = 42
    const top = 54
    const bottom = ctx.height - 54
    const lows = candles.map((candle) => candle.low)
    const highs = candles.map((candle) => candle.high)
    const low = Math.min(...lows) - 2
    const high = Math.max(...highs) + 2
    const yOf = (value: number): number => p.map(value, low, high, bottom, top)
    const step = (ctx.width - margin * 2) / count
    const grid = p.color(pal.dim)
    grid.setAlpha(65)
    p.stroke(grid)
    p.strokeWeight(1)
    for (let y = top; y <= bottom; y += (bottom - top) / 6) p.line(margin, y, ctx.width - margin, y)
    for (let i = 0; i < count; i++) {
      const candle = candles[i]
      const x = margin + (i + 0.5) * step
      const color = candle.close >= candle.open ? pal.signal : pal.accent
      p.stroke(color)
      p.strokeWeight(1)
      p.line(x, yOf(candle.high), x, yOf(candle.low))
      p.noStroke()
      p.fill(color)
      const y1 = yOf(candle.open)
      const y2 = yOf(candle.close)
      p.rect(x - step * 0.31, Math.min(y1, y2), step * 0.62, Math.max(2, Math.abs(y2 - y1)))
    }
    p.noFill()
    p.stroke(pal.paper)
    p.strokeWeight(2)
    p.beginShape()
    for (let i = 6; i < count; i++) {
      let average = 0
      for (let j = i - 6; j <= i; j++) average += candles[j].close / 7
      p.vertex(margin + (i + 0.5) * step, yOf(average))
    }
    p.endShape()
  }
}
