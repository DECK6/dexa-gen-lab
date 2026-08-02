import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 68

interface Body {
  x: number
  y: number
  vx: number
  vy: number
  mass: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const bodies: Body[] = []
  let gravity = 0
  let soft = 0

  const populate = () => {
    bodies.length = 0
    for (let i = 0; i < COUNT; i++) {
      const a = p.random(p.TWO_PI)
      const r = p.random(p.width * 0.08, p.width * 0.34)
      bodies.push({
        x: p.width / 2 + Math.cos(a) * r,
        y: p.height / 2 + Math.sin(a) * r,
        vx: -Math.sin(a) * p.random(0.2, 1.1),
        vy: Math.cos(a) * p.random(0.2, 1.1),
        mass: p.random(0.7, 2.2),
      })
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    gravity = p.width * p.width * 0.00035
    soft = p.width * 0.027
    populate()
  }

  p.draw = () => {
    if (p.frameCount % 720 === 0) populate()
    const veil = p.color(pal.bg)
    veil.setAlpha(18)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i]
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d2 = dx * dx + dy * dy + soft * soft
        const pull = gravity / (d2 * Math.sqrt(d2))
        a.vx += dx * pull * b.mass
        a.vy += dy * pull * b.mass
        b.vx -= dx * pull * a.mass
        b.vy -= dy * pull * a.mass
      }
    }

    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    p.strokeWeight(1)
    for (let i = 0; i < bodies.length; i++) {
      const o = bodies[i]
      const ox = o.x
      const oy = o.y
      o.vx *= 0.998
      o.vy *= 0.998
      o.x += o.vx * 0.48
      o.y += o.vy * 0.48
      if (o.x < 0 || o.x > p.width) o.vx *= -1
      if (o.y < 0 || o.y > p.height) o.vy *= -1
      o.x = p.constrain(o.x, 0, p.width)
      o.y = p.constrain(o.y, 0, p.height)
      const speed = Math.hypot(o.vx, o.vy)
      cyan.setAlpha(70 + Math.min(speed * 28, 130))
      orange.setAlpha(190)
      p.stroke(i % 17 === 0 ? orange : cyan)
      p.line(ox, oy, o.x, o.y)
      p.strokeWeight(1 + o.mass * 0.45)
      p.point(o.x, o.y)
      p.strokeWeight(1)
    }
  }
}
