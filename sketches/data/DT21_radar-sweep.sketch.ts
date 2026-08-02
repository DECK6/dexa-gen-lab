import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Target {
  angle: number
  radius: number
  drift: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const targets: Target[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 16; i++) targets.push({ angle: p.random(p.TWO_PI), radius: p.random(0.16, 0.95), drift: p.random(0.35, 1.1) })
  }

  p.draw = () => {
    p.background(pal.bg)
    const cx = ctx.width / 2
    const cy = ctx.height / 2
    const radius = Math.min(ctx.width, ctx.height) * 0.4
    const sweep = p.frameCount * 0.028 % p.TWO_PI
    const grid = p.color(pal.dim)
    grid.setAlpha(110)
    p.noFill()
    p.stroke(grid)
    p.strokeWeight(1)
    for (let ring = 1; ring <= 4; ring++) p.circle(cx, cy, radius * ring / 2)
    p.line(cx - radius, cy, cx + radius, cy)
    p.line(cx, cy - radius, cx, cy + radius)
    for (let i = 24; i >= 0; i--) {
      const angle = sweep - i * 0.022
      const trail = p.color(pal.signal)
      trail.setAlpha(8 + (24 - i) * 5)
      p.stroke(trail)
      p.strokeWeight(1 + (24 - i) / 18)
      p.line(cx, cy, cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
    }
    p.stroke(pal.paper)
    p.strokeWeight(2)
    p.line(cx, cy, cx + Math.cos(sweep) * radius, cy + Math.sin(sweep) * radius)
    const t = p.frameCount * 0.01
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      const angle = target.angle + Math.sin(t * target.drift + i) * 0.035
      const distanceBehind = (sweep - angle + p.TWO_PI) % p.TWO_PI
      if (distanceBehind > 0.82) continue
      const echo = 1 - distanceBehind / 0.82
      const x = cx + Math.cos(angle) * radius * target.radius
      const y = cy + Math.sin(angle) * radius * target.radius
      const blip = p.color(i % 6 === 0 ? pal.accent : pal.signal)
      blip.setAlpha(35 + echo * 220)
      p.noStroke()
      p.fill(blip)
      p.circle(x, y, 4 + echo * 8)
      p.noFill()
      p.stroke(blip)
      p.strokeWeight(1)
      p.circle(x, y, 12 + (1 - echo) * 16)
    }
    p.noStroke()
    p.fill(pal.accent)
    p.circle(cx, cy, 7)
  }
}
