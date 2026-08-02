import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 980
const U = 1.75

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const px: number[] = []
  const py: number[] = []
  const age: number[] = []
  let radius = 0

  const spawn = (i: number, lead = false) => {
    px[i] = lead ? p.random(-20, p.width) : p.random(-25, -4)
    py[i] = p.random(p.height)
    age[i] = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    radius = Math.min(p.width, p.height) * 0.12
    for (let i = 0; i < COUNT; i++) spawn(i, true)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(17)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cx = p.width / 2
    const cy = p.height / 2
    const a2 = radius * radius
    const cyan = p.color(pal.signal)
    for (let i = 0; i < COUNT; i++) {
      const x = px[i]!
      const y = py[i]!
      const dx = x - cx
      const dy = y - cy
      const r2 = dx * dx + dy * dy
      if (r2 < a2 * 1.04) {
        spawn(i)
        continue
      }
      const r4 = r2 * r2
      const ux = U * (1 - a2 * (dx * dx - dy * dy) / r4)
      const uy = -2 * U * a2 * dx * dy / r4
      px[i] = x + ux
      py[i] = y + uy
      age[i]!++
      const speed = p.constrain(Math.sqrt(ux * ux + uy * uy) / (U * 1.8), 0, 1)
      cyan.setAlpha(34 + speed * 130)
      p.stroke(cyan)
      p.strokeWeight(0.65 + speed * 0.65)
      p.line(x, y, px[i]!, py[i]!)
      if (px[i]! > p.width + 8 || py[i]! < -8 || py[i]! > p.height + 8 || age[i]! > 720) spawn(i)
    }

    const orange = p.color(pal.accent)
    orange.setAlpha(190)
    p.fill(pal.ink)
    p.stroke(orange)
    p.strokeWeight(1.5)
    p.circle(cx, cy, radius * 2)
    p.noStroke()
    p.fill(orange)
    p.circle(cx - radius, cy, 5)
    p.circle(cx + radius, cy, 5)
  }
}
