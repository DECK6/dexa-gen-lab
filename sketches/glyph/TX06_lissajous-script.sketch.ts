import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const STEPS = 8 // pen substeps per frame

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let margin = 0
  let lineH = 0
  let lineY = 0
  let penX = 0
  let px = 0
  let py = 0
  let t = 0
  let a = 1
  let b = 1.6
  let ph = 0
  let amp = 0

  const newHand = () => {
    a = p.random(0.8, 1.4)
    b = a * p.random(1.4, 2.7)
    ph = p.random(p.TWO_PI)
    amp = p.random(0.22, 0.34)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    margin = p.width * 0.1
    lineH = p.height * 0.17
    lineY = margin + lineH * 0.4
    penX = margin
    px = penX
    py = lineY
    newHand()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(5)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    // ruled paper
    const rule = p.color(pal.dim)
    rule.setAlpha(38)
    p.fill(rule)
    for (let y = margin + lineH * 0.4; y < p.height - margin * 0.4; y += lineH) {
      p.rect(margin, y + lineH * 0.3, p.width - margin * 2, 1)
    }

    const ink = p.color(pal.signal)
    ink.setAlpha(190)
    p.stroke(ink)

    for (let s = 0; s < STEPS; s++) {
      t += 0.055
      const ax = lineH * amp * 0.9
      const ay = lineH * amp
      const x = penX + Math.sin(a * t + ph) * ax
      const y = lineY + Math.sin(b * t) * ay + Math.sin(t * 0.31) * lineH * 0.06
      // pen pressure follows vertical velocity
      p.strokeWeight(0.5 + 1.9 * Math.abs(Math.cos(b * t)))
      p.line(px, py, x, y)
      px = x
      py = y
      penX += 0.95

      if (penX > p.width - margin) {
        penX = margin
        lineY += lineH
        if (lineY > p.height - margin) {
          lineY = margin + lineH * 0.4
          newHand()
        }
        px = penX
        py = lineY
      }
    }

    // pen tip
    p.noStroke()
    const tip = p.color(pal.accent)
    tip.setAlpha(230)
    p.fill(tip)
    p.circle(px, py, 3.4)
    tip.setAlpha(45)
    p.fill(tip)
    p.circle(px, py, 13)
  }
}
