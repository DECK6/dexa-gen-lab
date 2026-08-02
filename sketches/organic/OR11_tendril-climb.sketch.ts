import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COILS = 10
const POINTS = 210
const CYCLE = 360

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let radius = 0
  let phase = 0
  let lean = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    radius = p.width * p.random(0.045, 0.075)
    phase = p.random(p.TWO_PI)
    lean = p.random(-0.05, 0.05)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(pal.bg)
    const age = (p.frameCount - 1) % CYCLE
    const grown = Math.min(POINTS, 12 + age * 2.4)
    const fade = age > 310 ? 1 - (age - 310) / 50 : 1
    const cx = p.width / 2
    const bottom = p.height * 0.94
    const span = p.height * 0.84
    const sway = Math.sin(p.frameCount * 0.018) * p.width * 0.008

    const guide = p.color(pal.dim)
    guide.setAlpha(115 * fade)
    p.stroke(guide)
    p.strokeWeight(p.width * 0.012)
    p.line(cx - sway, bottom + 8, cx + lean * span + sway, bottom - span - 8)

    const vine = p.color(pal.signal)
    const hot = p.color(pal.accent)
    let px = cx
    let py = bottom
    for (let i = 0; i < Math.floor(grown); i++) {
      const u = i / (POINTS - 1)
      const a = phase + u * COILS * p.TWO_PI + p.frameCount * 0.004
      const depth = Math.cos(a)
      const x = cx + lean * span * u + Math.sin(a) * radius * (0.6 + u * 0.4) + sway * u
      const y = bottom - span * u
      vine.setAlpha((80 + (depth + 1) * 60) * fade)
      p.stroke(vine)
      p.strokeWeight((1.1 + (depth + 1) * 0.75) * (1 - u * 0.35))
      if (i > 0) p.line(px, py, x, y)
      if (i > 20 && i % 24 === 0) {
        const side = Math.sin(a) >= 0 ? 1 : -1
        const leaf = radius * (0.42 + u * 0.22)
        vine.setAlpha(75 * fade)
        p.stroke(vine)
        p.line(x, y, x + side * leaf, y - leaf * 0.35)
        p.noFill()
        p.ellipse(x + side * leaf * 1.25, y - leaf * 0.44, leaf * 0.65, leaf * 0.35)
      }
      px = x
      py = y
    }
    hot.setAlpha(220 * fade)
    p.noStroke()
    p.fill(hot)
    p.ellipse(px, py, 5, 5)
  }
}
