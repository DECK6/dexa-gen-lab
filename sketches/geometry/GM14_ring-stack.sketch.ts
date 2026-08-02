import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const RINGS = 26

interface Ring {
  weight: number
  phase: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const rings: Ring[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    for (let i = 0; i < RINGS; i++) {
      rings.push({ weight: p.random(0.7, 2.2), phase: p.random(-0.3, 0.3), hot: i === 5 || i === 18 })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.018
    const maxR = p.min(p.width, p.height) * 0.44
    const spread = 0.5 + 0.5 * p.sin(t * 0.72)

    for (let i = RINGS - 1; i >= 0; i--) {
      const ring = rings[i]!
      const order = (i + 1) / RINGS
      const pulse = p.sin(t * 1.2 + i * 0.42 + ring.phase)
      const radius = maxR * order + pulse * (4 + spread * 8)
      const y = (i - (RINGS - 1) / 2) * spread * 2.2 + pulse * spread * 9
      const squash = 0.72 + spread * 0.2
      const line = p.color(ring.hot ? pal.accent : pal.signal)
      line.setAlpha(ring.hot ? 190 : 65 + (1 - order) * 90)
      p.stroke(line)
      p.strokeWeight(ring.hot ? ring.weight + 0.6 : ring.weight)
      p.ellipse(p.width / 2, p.height / 2 + y, radius * 2, radius * 2 * squash)
    }

    const axis = p.color(pal.dim)
    axis.setAlpha(110)
    p.stroke(axis)
    p.strokeWeight(1)
    p.line(p.width / 2, 26, p.width / 2, p.height - 26)
  }
}
