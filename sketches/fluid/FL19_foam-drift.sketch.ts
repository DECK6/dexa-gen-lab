import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Bubble {
  x: number
  y: number
  r: number
  vx: number
  vy: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const bubbles: Bubble[] = []

  function reset(bubble: Bubble, edge: boolean) {
    bubble.x = edge ? p.random(-20, 0) : p.random(ctx.width * 0.08, ctx.width * 0.92)
    bubble.y = p.random(ctx.height * 0.23, ctx.height * 0.77)
    bubble.r = p.random(5, 17)
    bubble.vx = p.random(0.08, 0.35)
    bubble.vy = p.random(-0.12, 0.12)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 62; i++) {
      const bubble = { x: 0, y: 0, r: 0, vx: 0, vy: 0 }
      reset(bubble, false)
      bubbles.push(bubble)
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const f = p.frameCount
    for (const bubble of bubbles) {
      const flow = p.noise(bubble.x * 0.006, bubble.y * 0.008, f * 0.003)
      bubble.vx = (bubble.vx + 0.012 + (flow - 0.5) * 0.025) * 0.985
      bubble.vy = (bubble.vy + (flow - 0.5) * 0.035) * 0.97
      bubble.x += bubble.vx
      bubble.y += bubble.vy
      if (bubble.x - bubble.r > ctx.width) reset(bubble, true)
      if (bubble.y < ctx.height * 0.18 || bubble.y > ctx.height * 0.82) bubble.vy *= -1
    }

    for (let i = 0; i < bubbles.length; i++) {
      const a = bubbles[i]
      for (let j = i + 1; j < bubbles.length; j++) {
        const b = bubbles[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const distance = Math.max(0.01, Math.hypot(dx, dy))
        const overlap = a.r + b.r - distance
        if (overlap <= 0) continue
        const nx = dx / distance
        const ny = dy / distance
        a.x -= nx * overlap * 0.25
        a.y -= ny * overlap * 0.25
        b.x += nx * overlap * 0.25
        b.y += ny * overlap * 0.25
        a.vx -= nx * 0.015
        b.vx += nx * 0.015
        if (Math.min(a.r, b.r) < 8 && distance < (a.r + b.r) * 0.62 && (f + i * 3 + j) % 89 === 0) {
          const large = a.r >= b.r ? a : b
          const small = a.r >= b.r ? b : a
          large.r = Math.min(24, Math.sqrt(large.r * large.r + small.r * small.r))
          reset(small, true)
        }
      }
    }

    const web = p.color(ctx.palette.signal)
    web.setAlpha(65)
    p.stroke(web)
    p.strokeWeight(1)
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const a = bubbles[i]
        const b = bubbles[j]
        if (Math.hypot(a.x - b.x, a.y - b.y) < (a.r + b.r) * 1.32) p.line(a.x, a.y, b.x, b.y)
      }
    }
    p.noFill()
    for (const bubble of bubbles) {
      const color = p.color(bubble.r < 7 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(175)
      p.stroke(color)
      p.strokeWeight(1.2)
      p.circle(bubble.x, bubble.y, bubble.r * 2)
    }
  }
}
