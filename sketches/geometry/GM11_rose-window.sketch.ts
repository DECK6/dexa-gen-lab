import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SPOKES = 12
const RINGS = 5

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    phase = p.random(p.TWO_PI)
  }

  p.draw = () => {
    p.background(pal.bg)
    p.translate(p.width / 2, p.height / 2)
    const t = p.frameCount * 0.015 + phase
    const step = p.TWO_PI / SPOKES
    const radius = p.min(p.width, p.height) * 0.46

    const guide = p.color(pal.dim)
    guide.setAlpha(75)
    p.stroke(guide)
    p.strokeWeight(1)
    for (let r = 1; r <= RINGS; r++) p.circle(0, 0, (radius * r * 2) / RINGS)

    for (let ring = 0; ring < RINGS; ring++) {
      const inner = (radius * ring) / RINGS
      const outer = (radius * (ring + 1)) / RINGS
      const mid = (inner + outer) / 2
      const gate = 0.18 + 0.72 * (0.5 + 0.5 * p.sin(t * 1.4 - ring * 0.72))
      const turn = t * (ring % 2 === 0 ? 0.22 : -0.18) + ring * 0.07
      const hot = ring === 1
      const line = p.color(hot ? pal.accent : pal.signal)
      line.setAlpha(hot ? 180 : 105 + gate * 75)
      p.stroke(line)
      p.strokeWeight(hot ? 1.5 : 1.05)

      for (let spoke = 0; spoke < SPOKES; spoke++) {
        const a = spoke * step + turn
        const half = step * gate * 0.43
        p.bezier(
          p.cos(a) * inner,
          p.sin(a) * inner,
          p.cos(a - half) * mid,
          p.sin(a - half) * mid,
          p.cos(a - half * 0.55) * outer,
          p.sin(a - half * 0.55) * outer,
          p.cos(a) * outer,
          p.sin(a) * outer,
        )
        p.bezier(
          p.cos(a) * outer,
          p.sin(a) * outer,
          p.cos(a + half * 0.55) * outer,
          p.sin(a + half * 0.55) * outer,
          p.cos(a + half) * mid,
          p.sin(a + half) * mid,
          p.cos(a) * inner,
          p.sin(a) * inner,
        )
      }
    }

    const hub = p.color(pal.paper)
    hub.setAlpha(190)
    p.stroke(hub)
    p.strokeWeight(2.5)
    p.point(0, 0)
  }
}
