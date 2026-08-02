import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SPOKES = 180
const GOLDEN = 137.507764
const CYCLE = 300

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    phase = p.random(p.TWO_PI)
  }

  p.draw = () => {
    p.background(pal.bg)
    p.translate(p.width / 2, p.height / 2)
    const radius = p.min(p.width, p.height) * 0.45
    const spin = p.frameCount * 0.0014 + phase

    for (let i = 0; i < SPOKES; i++) {
      const age = (p.frameCount * 1.8 - i * 1.35 + CYCLE) % CYCLE
      if (age > 220) continue
      const grow = p.min(1, age / 38)
      const fade = p.min(1, (220 - age) / 50)
      const eased = 1 - (1 - grow) * (1 - grow)
      const angle = p.radians(i * GOLDEN) + spin
      const length = radius * (0.22 + eased * 0.78)
      const hot = age < 12
      const line = p.color(hot ? pal.accent : pal.signal)
      line.setAlpha((hot ? 220 : 32 + 80 * grow) * fade)
      p.stroke(line)
      p.strokeWeight(hot ? 1.8 : 0.9)
      p.line(p.cos(angle) * 12, p.sin(angle) * 12, p.cos(angle) * length, p.sin(angle) * length)
    }

    const hub = p.color(pal.paper)
    hub.setAlpha(180)
    p.noStroke()
    p.fill(hub)
    p.circle(0, 0, 5)
  }
}
