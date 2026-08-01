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
  let cx = 0
  let cy = 0
  let span = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    a = p.random(-1.9, 1.9)
    b = p.random(-1.9, 1.9)
    c = p.random(-1.7, 1.7)
    d = p.random(-1.7, 1.7)
    x = p.random(-0.5, 0.5)
    y = p.random(-0.5, 0.5)
    cx = p.width / 2
    cy = p.height / 2
    span = Math.min(p.width, p.height) * 0.4
    p.strokeWeight(1)
  }

  p.draw = () => {
    // first frames run hot so the smoke has body within a second
    const boost = p.constrain(1 - (p.frameCount - 100) / 300, 0, 1)

    const veil = p.color(pal.bg)
    veil.setAlpha(3)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const t = p.frameCount
    const aa = a + 0.42 * Math.sin(t * 0.00034)
    const bb = b + 0.42 * Math.sin(t * 0.00027 + 2.2)
    const cc = c + 0.3 * Math.sin(t * 0.00019 + 4.1)
    const dd = d + 0.3 * Math.sin(t * 0.00023 + 5.5)
    const scale = span / (1 + Math.max(Math.abs(cc), Math.abs(dd)))

    // density buckets: slow orbit segments burn in, fast ones stay smoke
    const cols = [40, 23, 13].map((alpha) => {
      const col = p.color(pal.signal)
      col.setAlpha(Math.min(255, alpha * (1 + 0.5 * boost)))
      return col
    })

    p.strokeWeight(1 + 0.35 * boost)
    let bucket = -1
    for (let i = 0; i < PTS; i++) {
      const nx = Math.sin(aa * y) + cc * Math.cos(aa * x)
      const ny = Math.sin(bb * x) + dd * Math.cos(bb * y)
      const hop = Math.abs(nx - x) + Math.abs(ny - y)
      x = nx
      y = ny
      const bk = hop < 0.35 ? 0 : hop < 1.1 ? 1 : 2
      if (bk !== bucket) {
        p.stroke(cols[bk])
        bucket = bk
      }
      p.point(cx + x * scale, cy + y * scale)
    }

    const orange = p.color(pal.accent)
    orange.setAlpha(70)
    p.stroke(orange)
    p.strokeWeight(1.8)
    p.point(cx + x * scale, cy + y * scale)
    p.strokeWeight(1)
  }
}
