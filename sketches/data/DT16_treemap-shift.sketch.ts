import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const groups = 4
  const children = 3
  const phases: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.textFont('monospace')
    for (let i = 0; i < groups * children; i++) phases.push(p.random(p.TWO_PI))
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.012
    const margin = 34
    const gap = 5
    const innerW = ctx.width - margin * 2 - gap * (groups - 1)
    const innerH = ctx.height - margin * 2
    const weights = phases.map((phase, i) => 0.45 + (Math.sin(t * (0.7 + i * 0.018) + phase) + 1) * 0.55)
    const totals = Array.from({ length: groups }, (_, group) => {
      let total = 0
      for (let i = 0; i < children; i++) total += weights[group * children + i]
      return total
    })
    const grandTotal = totals.reduce((sum, value) => sum + value, 0)
    const largest = Math.max(...weights)
    let x = margin
    for (let group = 0; group < groups; group++) {
      const groupW = innerW * totals[group] / grandTotal
      let y = margin
      for (let child = 0; child < children; child++) {
        const index = group * children + child
        const h = innerH * weights[index] / totals[group]
        const tile = p.color(weights[index] === largest ? pal.accent : pal.signal)
        tile.setAlpha(65 + weights[index] / largest * 125)
        p.fill(tile)
        p.stroke(pal.bg)
        p.strokeWeight(4)
        p.rect(x, y, groupW, h)
        p.noFill()
        const edge = p.color(pal.paper)
        edge.setAlpha(90)
        p.stroke(edge)
        p.strokeWeight(1)
        p.rect(x + 3, y + 3, Math.max(0, groupW - 6), Math.max(0, h - 6))
        p.noStroke()
        p.fill(pal.paper)
        p.textSize(9)
        if (groupW > 42 && h > 30) p.text(`${group}.${child}`, x + 9, y + 16)
        y += h
      }
      x += groupW + gap
    }
  }
}
