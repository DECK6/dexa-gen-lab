import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const CABLES = 3
const SEGMENTS = 72

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const t = p.frameCount * 0.018
    const dim = p.color(ctx.palette.dim)
    dim.setAlpha(55)
    p.stroke(dim)
    p.strokeWeight(3)
    for (let rib = 0; rib < 18; rib++) {
      const x = (rib + 0.5) * (p.width / 18)
      p.line(x, 0, x, p.height)
    }

    for (let cable = 0; cable < CABLES; cable++) {
      const center = p.width * ((cable + 1) / (CABLES + 1))
      const amplitude = p.width * 0.055
      for (let segment = -1; segment < SEGMENTS; segment++) {
        const y1 = segment * (p.height / SEGMENTS)
        const y2 = (segment + 1.25) * (p.height / SEGMENTS)
        const a1 = y1 * 0.031 + t + cable * 0.7
        const a2 = y2 * 0.031 + t + cable * 0.7
        const first = { x1: center + Math.sin(a1) * amplitude, x2: center + Math.sin(a2) * amplitude, depth: Math.cos((a1 + a2) / 2) }
        const second = { x1: center - Math.sin(a1) * amplitude, x2: center - Math.sin(a2) * amplitude, depth: -Math.cos((a1 + a2) / 2) }
        const strands = first.depth < second.depth ? [first, second] : [second, first]
        for (let layer = 0; layer < strands.length; layer++) {
          const strand = strands[layer]!
          p.stroke(ctx.palette.ink)
          p.strokeWeight(layer === 0 ? 11 : 15)
          p.line(strand.x1, y1, strand.x2, y2)
          const yarn = p.color(layer === 0 ? ctx.palette.dim : ctx.palette.signal)
          yarn.setAlpha(layer === 0 ? 155 : 235)
          p.stroke(yarn)
          p.strokeWeight(layer === 0 ? 5 : 8)
          p.line(strand.x1, y1, strand.x2, y2)
          if (layer === 1) {
            const highlight = p.color(ctx.palette.paper)
            highlight.setAlpha(85)
            p.stroke(highlight)
            p.strokeWeight(1.5)
            p.line(strand.x1 - 2, y1, strand.x2 - 2, y2)
          }
        }
      }
      p.noStroke()
      p.fill(ctx.palette.accent)
      const crossingY = ((p.TWO_PI - ((t + cable * 0.7) % p.TWO_PI)) / 0.031) % p.height
      p.circle(center, crossingY, 6)
    }
  }
}
