import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const levels = 14
  const bids = new Array<number>(levels).fill(0)
  const asks = new Array<number>(levels).fill(0)
  let tradeSide = 1
  let tradeSize = 0
  let flash = 0

  const consume = (book: number[], quantity: number) => {
    let rest = quantity
    while (rest > 0) {
      const fill = Math.min(book[0]!, rest)
      book[0] -= fill; rest -= fill
      if (book[0]! <= 0.01) { book.shift(); book.push(p.random(8, 28)) }
    }
  }

  const update = () => {
    bids[p.floor(p.random(levels))]! += p.random(1, 8)
    asks[p.floor(p.random(levels))]! += p.random(1, 8)
    tradeSize = p.random(5, 26)
    tradeSide = p.random() < 0.5 ? -1 : 1
    consume(tradeSide > 0 ? asks : bids, tradeSize)
    flash = 11
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < levels; i++) { bids[i] = p.random(8, 42); asks[i] = p.random(8, 42) }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    if (p.frameCount % 5 === 0) update()
    if (flash > 0) flash--
    const center = p.width / 2
    const top = 72
    const row = 35
    const grid = p.color(ctx.palette.signal); grid.setAlpha(42)
    p.textAlign(p.CENTER); p.textSize(9)
    for (let i = 0; i < levels; i++) {
      const y = top + i * row
      const bw = Math.min(225, bids[i]! * 4.2)
      const aw = Math.min(225, asks[i]! * 4.2)
      p.stroke(grid); p.line(45, y + 12, p.width - 45, y + 12)
      p.noStroke(); p.fill(ctx.palette.signal); p.rect(center - 18 - bw, y, bw, 20, 2)
      const ask = p.color(ctx.palette.accent); ask.setAlpha(115 + Math.min(120, asks[i]! * 2))
      p.fill(ask); p.rect(center + 18, y, aw, 20, 2)
      p.fill(ctx.palette.paper); p.text((100 + (levels - i) * 0.25).toFixed(2), center, y + 14)
    }
    p.stroke(ctx.palette.paper); p.strokeWeight(2); p.line(center, 53, center, 568)
    if (flash > 0) {
      p.noStroke(); p.fill(ctx.palette.accent)
      const x = center + tradeSide * (18 + (11 - flash) * 12)
      p.circle(x, 53 + ((p.frameCount * 37) % 480), 8 + tradeSize * 0.12)
    }
    p.noStroke(); p.fill(ctx.palette.signal); p.textAlign(p.LEFT); p.textSize(11); p.text('BID DEPTH', 48, 595)
    p.fill(ctx.palette.accent); p.textAlign(p.RIGHT); p.text('ASK DEPTH', p.width - 48, 595)
  }
}
