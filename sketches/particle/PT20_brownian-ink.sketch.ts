import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 620

interface Walker {
  x: number
  y: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const walkers: Walker[] = []

  const restart = () => {
    p.background(pal.bg)
    walkers.length = 0
    for (let i = 0; i < COUNT; i++) {
      const a = p.random(p.TWO_PI)
      const r = p.random(p.width * 0.02, p.width * 0.12)
      walkers.push({ x: p.width / 2 + Math.cos(a) * r, y: p.height / 2 + Math.sin(a) * r, hot: p.random() < 0.025 })
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    restart()
  }

  p.draw = () => {
    if (p.frameCount % 660 === 0) restart()
    const steps = p.frameCount < 90 ? 3 : 1
    const cyan = p.color(pal.signal)
    cyan.setAlpha(24)
    const orange = p.color(pal.accent)
    orange.setAlpha(54)
    p.strokeWeight(1)
    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < walkers.length; i++) {
        const o = walkers[i]
        const ox = o.x
        const oy = o.y
        const dx = p.random(-1, 1) + p.random(-1, 1) + p.random(-1, 1)
        const dy = p.random(-1, 1) + p.random(-1, 1) + p.random(-1, 1)
        o.x += dx * 1.45
        o.y += dy * 1.45
        if (o.x < 0 || o.x > p.width || o.y < 0 || o.y > p.height) {
          o.x = p.width / 2 + p.random(-12, 12)
          o.y = p.height / 2 + p.random(-12, 12)
        }
        p.stroke(o.hot ? orange : cyan)
        p.line(ox, oy, o.x, o.y)
      }
    }

    const wash = p.color(pal.bg)
    wash.setAlpha(p.frameCount % 660 > 600 ? 10 : 1)
    p.noStroke()
    p.fill(wash)
    p.rect(0, 0, p.width, p.height)
  }
}
