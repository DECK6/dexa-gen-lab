import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const PTS = 4800
const STEPS = 6

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let x = 0
  let y = 0
  let a = 0
  let b = 0
  let c = 0
  let reach = 1
  let cx = 0
  let cy = 0
  let span = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    a = p.random(-4, 4)
    b = p.random(0.4, 3.2)
    c = p.random(-4, 4)
    cx = p.width / 2
    cy = p.height / 2
    span = Math.min(p.width, p.height) * 0.44
    // warm up the running extent so the first drawn frame is already fitted
    for (let i = 0; i < 3000; i++) {
      const nx = y - Math.sign(x) * Math.sqrt(Math.abs(b * x - c))
      y = a - x
      x = nx
      reach = Math.max(reach, Math.abs(x), Math.abs(y))
    }
    p.strokeWeight(1)
  }

  p.draw = () => {
    // first frames run hot so the shell is legible within a second
    const boost = p.constrain(1 - (p.frameCount - 100) / 300, 0, 1)

    const veil = p.color(pal.bg)
    veil.setAlpha(3)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const t = p.frameCount
    const aa = a + 1.1 * Math.sin(t * 0.00041)
    const cc = c + 1.1 * Math.sin(t * 0.00029 + 2.4)
    const scale = span / reach

    // alternating tone reads as strata; later points land brighter, so the
    // freshest sweep always sits on top of the accumulated shell
    const tones = [0, 1, 2, 3, 4, 5].map((s) => {
      const col = p.color(s % 2 === 0 ? pal.signal : pal.dim)
      col.setAlpha(Math.min(255, (20 + 38 * (s / (STEPS - 1))) * (1 + 0.6 * boost)))
      return col
    })
    const chunk = Math.ceil(PTS / STEPS)

    p.strokeWeight(1 + 0.35 * boost)
    p.stroke(tones[0])
    for (let i = 0; i < PTS; i++) {
      const nx = y - Math.sign(x) * Math.sqrt(Math.abs(b * x - cc))
      const ny = aa - x
      x = nx
      y = ny
      const r = Math.max(Math.abs(x), Math.abs(y))
      if (r > reach) reach = r
      if (i % chunk === 0) p.stroke(tones[Math.min(STEPS - 1, Math.floor(i / chunk))])
      p.point(cx + x * scale, cy + y * scale)
    }
    reach = Math.max(reach * 0.9992, 1)

    const orange = p.color(pal.accent)
    orange.setAlpha(110)
    p.stroke(orange)
    p.strokeWeight(2.4)
    p.point(cx + x * scale, cy + y * scale)
    p.strokeWeight(1)
  }
}
