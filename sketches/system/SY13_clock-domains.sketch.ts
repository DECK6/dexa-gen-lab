import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Domain { period: number; level: boolean; count: number }
interface Bridge { from: number; to: number; source: boolean; meta: boolean; sync: boolean }

export function sketch(p: P5, ctx: SketchCtx): void {
  const domains: Domain[] = [
    { period: 5, level: false, count: 0 },
    { period: 8, level: false, count: 0 },
    { period: 13, level: false, count: 0 },
  ]
  const bridges: Bridge[] = [
    { from: 0, to: 1, source: false, meta: false, sync: false },
    { from: 1, to: 2, source: false, meta: false, sync: false },
    { from: 2, to: 0, source: false, meta: false, sync: false },
  ]
  const history: boolean[][] = domains.map(() => [])

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    for (let i = 0; i < domains.length; i++) {
      const domain = domains[i]!
      if (p.frameCount % domain.period === 0) {
        domain.level = !domain.level
        domain.count++
        for (const bridge of bridges) if (bridge.from === i && domain.level) bridge.source = !bridge.source
      }
      if (p.frameCount % domain.period === 0) {
        for (const bridge of bridges) if (bridge.to === i) {
          bridge.sync = bridge.meta
          bridge.meta = bridge.source
        }
      }
      history[i]!.push(domain.level)
      if (history[i]!.length > 70) history[i]!.shift()
    }

    const centers = [115, 320, 525]
    for (let i = 0; i < domains.length; i++) {
      const x = centers[i]!
      const domain = domains[i]!
      const border = p.color(ctx.palette.signal); border.setAlpha(120)
      p.noFill(); p.stroke(border); p.strokeWeight(domain.level ? 2 : 1)
      p.rect(x - 74, 118, 148, 310, 5)
      p.noStroke(); p.fill(domain.level ? ctx.palette.signal : ctx.palette.dim)
      p.circle(x, 165, 18)
      p.fill(ctx.palette.paper); p.textAlign(p.CENTER); p.textSize(12)
      p.text(`/${domain.period}  ${domain.count}`, x, 205)
      p.noFill(); p.stroke(ctx.palette.signal); p.strokeWeight(1.5)
      p.beginShape()
      for (let k = 0; k < history[i]!.length; k++) p.vertex(x - 61 + k * 1.75, history[i]![k] ? 255 : 285)
      p.endShape()
    }
    for (let i = 0; i < bridges.length; i++) {
      const bridge = bridges[i]!
      const x1 = centers[bridge.from]!
      const x2 = centers[bridge.to]!
      const y = 350 + i * 55
      p.stroke(ctx.palette.dim); p.line(x1, y, x2, y)
      const xs = [p.lerp(x1, x2, 0.42), p.lerp(x1, x2, 0.58)]
      p.noStroke()
      p.fill(bridge.meta ? ctx.palette.accent : ctx.palette.bg); p.rect(xs[0]! - 9, y - 9, 18, 18)
      p.fill(bridge.sync ? ctx.palette.signal : ctx.palette.bg); p.rect(xs[1]! - 9, y - 9, 18, 18)
    }
  }
}
