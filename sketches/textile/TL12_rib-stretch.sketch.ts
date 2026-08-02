import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const RIBS = 25

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    p.noFill()
    const t = p.frameCount * 0.025
    const gap = p.width / (RIBS + 4)
    const shade = p.color(ctx.palette.dim)
    const rib = p.color(ctx.palette.signal)
    shade.setAlpha(80)
    rib.setAlpha(205)

    for (let i = 0; i < RIBS; i++) {
      const baseX = (i + 2.5) * gap
      for (let pass = 0; pass < 2; pass++) {
        p.stroke(pass === 0 ? shade : rib)
        p.strokeWeight(pass === 0 ? 10 : 2.4)
        p.beginShape()
        for (let y = -8; y <= p.height + 8; y += 8) {
          const strain = 1 + 0.18 * Math.sin(t + y * 0.018)
          const x = p.width / 2 + (baseX - p.width / 2) * strain
          p.vertex(x + Math.sin(y * 0.035 - t * 0.7 + i * 0.3) * 2.4, y)
        }
        p.endShape()
      }
    }

    const stitch = p.color(ctx.palette.paper)
    stitch.setAlpha(95)
    p.stroke(stitch)
    p.strokeWeight(1)
    for (let row = 0; row < 13; row++) {
      const y = (row + 0.5) * (p.height / 13) + Math.sin(t + row) * 5
      const squeeze = 1 + 0.18 * Math.sin(t + y * 0.018)
      for (let i = 1; i < RIBS; i += 2) {
        const x = p.width / 2 + ((i + 2.5) * gap - p.width / 2) * squeeze
        p.arc(x, y, gap * squeeze, 9, 0, p.PI)
      }
    }

    p.noStroke()
    p.fill(ctx.palette.accent)
    p.rect(p.width * 0.12, p.height * 0.91, p.width * (0.24 + 0.05 * Math.sin(t)), 3)
  }
}
