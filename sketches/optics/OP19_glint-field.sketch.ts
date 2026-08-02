import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Facet {
  nx: number
  ny: number
  phase: number
}

const COLS = 25
const ROWS = 19

export function sketch(p: P5, ctx: SketchCtx): void {
  const facets: Facet[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < COLS * ROWS; i++) {
      facets.push({ nx: p.random(-0.42, 0.42), ny: p.random(-0.34, 0.34), phase: p.random(p.TWO_PI) })
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    const hx = Math.sin(t * 0.63) * 0.36
    const hy = Math.cos(t * 0.47) * 0.3
    const hz = Math.sqrt(1 - hx * hx - hy * hy)
    const gapX = ctx.width * 0.034
    const gapY = ctx.height * 0.032

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const index = row * COLS + col
        const facet = facets[index]
        const nx = facet.nx + Math.sin(t * 0.9 + facet.phase) * 0.055
        const ny = facet.ny + Math.cos(t * 0.72 + facet.phase) * 0.045
        const nz = Math.sqrt(Math.max(0.08, 1 - nx * nx - ny * ny))
        const intensity = Math.pow(Math.max(0, nx * hx + ny * hy + nz * hz), 48)
        const x = ctx.width * 0.09 + col * gapX + (row % 2) * gapX * 0.5
        const y = ctx.height * 0.2 + row * gapY
        p.stroke(ctx.palette.dim)
        p.strokeWeight(1)
        p.line(x - 3, y + ny * 7, x + 3, y - ny * 7)
        if (intensity > 0.045) {
          const glint = p.color(index % 61 === 0 ? ctx.palette.accent : ctx.palette.signal)
          glint.setAlpha(Math.min(255, 38 + intensity * 280))
          p.stroke(glint)
          p.strokeWeight(1 + intensity * 2)
          const size = 2 + intensity * 14
          p.line(x - size, y, x + size, y)
          p.line(x, y - size * 0.55, x, y + size * 0.55)
        }
      }
    }

    p.noFill()
    p.stroke(ctx.palette.paper)
    p.rect(ctx.width * 0.07, ctx.height * 0.16, ctx.width * 0.86, ctx.height * 0.68)
  }
}
