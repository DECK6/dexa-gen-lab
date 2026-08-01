import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const CURVES = 5
const SEGMENTS = 620

interface Spiro {
  a: number
  b: number
  scale: number
  swing: number
  phase: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const fam: Spiro[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    for (let k = 0; k < CURVES; k++) {
      fam.push({
        a: 2 + p.floor(p.random(4)),
        b: 3 + p.floor(p.random(7)),
        scale: 0.94 - k * 0.13,
        swing: p.random(0.35, 0.85),
        phase: p.random(p.TWO_PI),
        hot: k === 1,
      })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.008
    const cx = p.width / 2
    const cy = p.height / 2
    const fit = p.min(p.width, p.height) * 0.44
    const spin = p.frameCount * 0.0016

    for (let k = 0; k < fam.length; k++) {
      const s = fam[k]!
      const r = s.a / s.b
      const d = r * (0.55 + s.swing * (0.5 + 0.5 * p.sin(t + s.phase)))
      const norm = (fit * s.scale) / (1 + r + d)
      const ratio = (1 + r) / r
      const rot = spin * (k % 2 ? -1 : 1) + s.phase * 0.1

      const line = p.color(s.hot ? pal.accent : pal.signal)
      line.setAlpha(s.hot ? 150 : 95)
      p.stroke(line)
      p.strokeWeight(s.hot ? 1.4 : 1)

      p.beginShape()
      for (let i = 0; i <= SEGMENTS; i++) {
        const th = (i / SEGMENTS) * p.TWO_PI * s.a + rot
        const x = (1 + r) * p.cos(th) - d * p.cos(ratio * th)
        const y = (1 + r) * p.sin(th) - d * p.sin(ratio * th)
        p.vertex(cx + x * norm, cy + y * norm)
      }
      p.endShape()

      // pen head running the curve
      const hi = ((p.frameCount * 3 + k * 130) % SEGMENTS) / SEGMENTS
      const th = hi * p.TWO_PI * s.a + rot
      const hx = cx + ((1 + r) * p.cos(th) - d * p.cos(ratio * th)) * norm
      const hy = cy + ((1 + r) * p.sin(th) - d * p.sin(ratio * th)) * norm
      const head = p.color(pal.paper)
      head.setAlpha(220)
      p.stroke(head)
      p.strokeWeight(3)
      p.point(hx, hy)
    }

    // fixed gear outline
    const gear = p.color(pal.dim)
    gear.setAlpha(70)
    p.stroke(gear)
    p.strokeWeight(1)
    p.circle(cx, cy, fit * 0.5)
  }
}
