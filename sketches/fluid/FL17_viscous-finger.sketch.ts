import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Tip {
  x: number
  y: number
  angle: number
  depth: number
  active: boolean
}

interface Segment {
  x1: number
  y1: number
  x2: number
  y2: number
  depth: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const tips: Tip[] = []
  const segments: Segment[] = []
  const inlet = ctx.width * 0.07

  function restart() {
    tips.length = 0
    segments.length = 0
    for (let i = 0; i < 8; i++) {
      tips.push({
        x: inlet,
        y: ctx.height * (0.2 + i * 0.6 / 7),
        angle: p.random(-0.16, 0.16),
        depth: 0,
        active: true,
      })
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    restart()
  }

  p.draw = () => {
    if (p.frameCount % 330 === 0) restart()
    const limit = tips.length
    for (let i = 0; i < limit; i++) {
      const tip = tips[i]
      if (!tip.active) continue
      const oldX = tip.x
      const oldY = tip.y
      const pressure = (p.noise(tip.x * 0.009, tip.y * 0.012, p.frameCount * 0.005) - 0.5) * 0.18
      tip.angle = Math.min(0.78, Math.max(-0.78, tip.angle * 0.94 + pressure))
      tip.x += Math.cos(tip.angle) * 2.05
      tip.y += Math.sin(tip.angle) * 2.05
      segments.push({ x1: oldX, y1: oldY, x2: tip.x, y2: tip.y, depth: tip.depth })
      if (p.random() < 0.006 && tips.length < 42) {
        const turn = p.random() < 0.5 ? -1 : 1
        tips.push({ x: oldX, y: oldY, angle: tip.angle + turn * p.random(0.28, 0.55), depth: tip.depth + 1, active: true })
        tip.angle -= turn * 0.08
      }
      if (tip.x > ctx.width * 0.94 || tip.y < ctx.height * 0.05 || tip.y > ctx.height * 0.95) tip.active = false
    }

    p.background(ctx.palette.ink)
    const invaded = p.color(ctx.palette.signal)
    invaded.setAlpha(45)
    p.strokeCap(p.ROUND)
    for (const segment of segments) {
      p.stroke(invaded)
      p.strokeWeight(Math.max(1.2, 5.2 - segment.depth * 0.35))
      p.line(segment.x1, segment.y1, segment.x2, segment.y2)
      const core = p.color(segment.depth > 2 ? ctx.palette.accent : ctx.palette.signal)
      core.setAlpha(175)
      p.stroke(core)
      p.strokeWeight(Math.max(0.7, 1.8 - segment.depth * 0.08))
      p.line(segment.x1, segment.y1, segment.x2, segment.y2)
    }
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    p.line(inlet, ctx.height * 0.12, inlet, ctx.height * 0.88)
    p.noStroke()
    p.fill(ctx.palette.accent)
    for (const tip of tips) if (tip.active) p.circle(tip.x, tip.y, 3.5)
  }
}
