import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const PTS = 4800

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let x = 0
  let y = 0
  let a = 0
  let b = 0
  let c = 0
  let d = 0
  let scale = 0
  let cx = 0
  let cy = 0

  // magnitudes below ~1.1 tend to collapse to fixed points — keep out of that band
  const pickParam = () => p.random(1.1, 2.4) * (p.random() < 0.5 ? -1 : 1)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    a = pickParam()
    b = pickParam()
    c = pickParam()
    d = pickParam()
    x = p.random(-1, 1)
    y = p.random(-1, 1)
    scale = Math.min(p.width, p.height) * 0.22
    cx = p.width / 2
    cy = p.height / 2
    p.strokeWeight(1)
  }

  p.draw = () => {
    // first frames run hot so the veil is legible within a second
    const boost = p.constrain(1 - (p.frameCount - 100) / 300, 0, 1)

    const veil = p.color(pal.bg)
    veil.setAlpha(2)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    // each parameter breathes on its own period — the veil never settles
    const t = p.frameCount
    const aa = a + 0.26 * Math.sin(t * 0.00061)
    const bb = b + 0.26 * Math.sin(t * 0.00043 + 1.7)
    const cc = c + 0.26 * Math.sin(t * 0.00052 + 3.1)
    const dd = d + 0.26 * Math.sin(t * 0.00037 + 4.6)

    const cyan = p.color(pal.signal)
    cyan.setAlpha(20 + 14 * boost)
    p.stroke(cyan)
    p.strokeWeight(1 + 0.4 * boost)
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (let i = 0; i < PTS; i++) {
      const nx = Math.sin(aa * y) - Math.cos(bb * x)
      const ny = Math.sin(cc * x) - Math.cos(dd * y)
      x = nx
      y = ny
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
      p.point(cx + x * scale, cy + y * scale)
    }
    // collapsed to a point/small cycle — re-roll the veil
    if (maxX - minX + (maxY - minY) < 0.5) {
      a = pickParam()
      b = pickParam()
      c = pickParam()
      d = pickParam()
    }

    // a handful of sparks riding the same orbit
    const orange = p.color(pal.accent)
    orange.setAlpha(80)
    p.stroke(orange)
    p.strokeWeight(1.8)
    for (let i = 0; i < 12; i++) {
      const nx = Math.sin(aa * y) - Math.cos(bb * x)
      const ny = Math.sin(cc * x) - Math.cos(dd * y)
      x = nx
      y = ny
      p.point(cx + x * scale, cy + y * scale)
    }
    p.strokeWeight(1)
  }
}
