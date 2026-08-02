import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const stages = 5
  const stock = [52, 48, 55, 50, 52]
  const order = new Array<number>(stages).fill(6)
  const transit: number[][] = Array.from({ length: stages }, (_, i) => new Array<number>(3 + i).fill(6))
  const traces: number[][] = Array.from({ length: stages }, () => [])
  let tick = 0

  const update = () => {
    tick++
    for (let i = 0; i < stages; i++) stock[i] += transit[i]!.shift() ?? 0
    let downstream = 7 + 4 * Math.sin(tick * 0.24) + (tick % 29 < 5 ? 5 : 0)
    for (let i = 0; i < stages; i++) {
      const shipped = Math.min(stock[i]!, downstream)
      stock[i] -= shipped
      order[i] = Math.max(0, downstream + (50 - stock[i]!) * 0.28)
      downstream = order[i]!
      if (i > 0) transit[i - 1]!.push(shipped)
    }
    transit[stages - 1]!.push(Math.min(22, order[stages - 1]!))
    for (let i = 0; i < stages; i++) {
      traces[i]!.push(stock[i]!)
      if (traces[i]!.length > 82) traces[i]!.shift()
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < 18; i++) update()
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    if (p.frameCount % 5 === 0) update()
    const xs = [82, 201, 320, 439, 558]
    const names = ['SHOP', 'HUB', 'DEPOT', 'PLANT', 'SOURCE']
    for (let i = 0; i < stages; i++) {
      const x = xs[i]!
      p.noFill(); p.stroke(ctx.palette.dim); p.rect(x - 39, 110, 78, 255)
      const h = p.constrain(stock[i]!, 0, 90) * 2.35
      p.noStroke(); p.fill(stock[i]! < 15 ? ctx.palette.accent : ctx.palette.signal)
      p.rect(x - 30, 355 - h, 60, h)
      p.fill(ctx.palette.paper); p.textAlign(p.CENTER); p.textSize(10); p.text(names[i]!, x, 389)
      p.fill(ctx.palette.accent); p.circle(x, 421, 4 + Math.min(14, order[i]! * 0.45))
      if (i < stages - 1) {
        p.stroke(ctx.palette.signal); p.line(x + 40, 238, xs[i + 1]! - 40, 238)
        const q = (p.frameCount * 0.018 + i * 0.21) % 1
        p.noStroke(); p.fill(ctx.palette.accent); p.circle(p.lerp(x + 40, xs[i + 1]! - 40, q), 238, 6)
      }
    }
    const faint = p.color(ctx.palette.signal); faint.setAlpha(95)
    p.noFill(); p.strokeWeight(1.2)
    for (let i = 0; i < stages; i++) {
      if (i === stages - 1) p.stroke(ctx.palette.accent)
      else p.stroke(faint)
      p.beginShape()
      for (let k = 0; k < traces[i]!.length; k++) p.vertex(44 + k * 6.7, 565 - p.constrain(traces[i]![k]!, 0, 90) * 1.2)
      p.endShape()
    }
  }
}
