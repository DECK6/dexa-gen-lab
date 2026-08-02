import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Spike {
  length: number
  velocity: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const spikes: Spike[] = []
  const count = 36
  const cx = ctx.width * 0.5
  const cy = ctx.height * 0.52
  const base = ctx.width * 0.17

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < count; i++) spikes.push({ length: p.random(16, 34), velocity: 0 })
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount * 0.018
    const mx = cx + Math.cos(t) * ctx.width * 0.29
    const my = cy + Math.sin(t * 1.27) * ctx.height * 0.23
    const magnetAngle = Math.atan2(my - cy, mx - cx)
    for (let i = 0; i < count; i++) {
      const angle = i * p.TWO_PI / count
      const alignment = Math.max(0, Math.cos(angle - magnetAngle))
      const field = Math.pow(alignment, 7)
      const target = 14 + field * 92 + Math.pow(Math.max(0, -Math.cos(angle - magnetAngle)), 9) * 25
      const spike = spikes[i]
      spike.velocity = (spike.velocity + (target - spike.length) * 0.085) * 0.79
      spike.length += spike.velocity
    }

    const body = p.color(ctx.palette.dim)
    body.setAlpha(115)
    p.fill(body)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(1.5)
    p.beginShape()
    for (let i = 0; i < count; i++) {
      const angle = i * p.TWO_PI / count
      const before = angle - p.TWO_PI / count * 0.33
      const after = angle + p.TWO_PI / count * 0.33
      p.vertex(cx + Math.cos(before) * base, cy + Math.sin(before) * base * 0.72)
      p.vertex(cx + Math.cos(angle) * (base + spikes[i].length), cy + Math.sin(angle) * (base * 0.72 + spikes[i].length))
      p.vertex(cx + Math.cos(after) * base, cy + Math.sin(after) * base * 0.72)
    }
    p.endShape(p.CLOSE)

    p.noFill()
    const contour = p.color(ctx.palette.paper)
    contour.setAlpha(90)
    p.stroke(contour)
    p.ellipse(cx, cy, base * 1.55, base * 0.95)
    p.stroke(ctx.palette.accent)
    p.line(mx - 8, my, mx + 8, my)
    p.line(mx, my - 8, mx, my + 8)
    p.circle(mx, my, 24)
    const guide = p.color(ctx.palette.accent)
    guide.setAlpha(70)
    p.stroke(guide)
    p.line(mx, my, cx, cy)
  }
}
