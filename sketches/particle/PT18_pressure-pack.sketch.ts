import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 230

interface Grain {
  x: number
  y: number
  vx: number
  vy: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const grains: Grain[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    const radius = p.width * 0.32
    for (let i = 0; i < COUNT; i++) {
      const a = p.random(p.TWO_PI)
      const r = Math.sqrt(p.random()) * radius
      grains.push({ x: p.width / 2 + Math.cos(a) * r, y: p.height / 2 + Math.sin(a) * r, vx: p.random(-1, 1), vy: p.random(-1, 1) })
    }
  }

  p.draw = () => {
    const phase = p.frameCount * p.TWO_PI / 300
    const radius = p.width * (0.34 + Math.sin(phase) * 0.085)
    const shrinking = Math.cos(phase) < 0
    const veil = p.color(pal.bg)
    veil.setAlpha(40)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    for (let i = 0; i < grains.length; i++) {
      const a = grains[i]
      for (let j = i + 1; j < grains.length; j++) {
        const b = grains[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy)
        if (d <= 0 || d >= 6) continue
        const push = (6 - d) * 0.018
        a.vx -= (dx / d) * push
        a.vy -= (dy / d) * push
        b.vx += (dx / d) * push
        b.vy += (dy / d) * push
      }
    }

    const cx = p.width / 2
    const cy = p.height / 2
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    p.strokeWeight(1)
    for (let i = 0; i < grains.length; i++) {
      const o = grains[i]
      let dx = o.x - cx
      let dy = o.y - cy
      let d = Math.hypot(dx, dy) || 1
      if (d > radius) {
        dx /= d
        dy /= d
        o.x = cx + dx * radius
        o.y = cy + dy * radius
        const outward = o.vx * dx + o.vy * dy
        o.vx -= dx * (outward * 1.7 + (shrinking ? 0.8 : 0.25))
        o.vy -= dy * (outward * 1.7 + (shrinking ? 0.8 : 0.25))
        d = radius
      }
      o.vx = (o.vx + p.random(-0.025, 0.025)) * 0.995
      o.vy = (o.vy + p.random(-0.025, 0.025)) * 0.995
      o.x += o.vx
      o.y += o.vy
      cyan.setAlpha(90 + (1 - d / radius) * 120)
      orange.setAlpha(205)
      p.stroke(i % 37 === 0 ? orange : cyan)
      p.line(o.x, o.y, o.x - o.vx * 3, o.y - o.vy * 3)
    }

    const shell = p.color(pal.signal)
    shell.setAlpha(145)
    p.noFill()
    p.stroke(shell)
    p.ellipse(cx, cy, radius * 2)
    const gauge = p.color(pal.accent)
    gauge.setAlpha(90)
    p.stroke(gauge)
    p.ellipse(cx, cy, radius * (shrinking ? 1.45 : 1.7))
  }
}
