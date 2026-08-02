import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Bokeh {
  x: number
  y: number
  depth: number
  vx: number
  vy: number
  phase: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const lights: Bokeh[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 46; i++) {
      lights.push({
        x: p.random(ctx.width),
        y: p.random(ctx.height),
        depth: p.random(0.25, 1),
        vx: p.random(-0.22, 0.22),
        vy: p.random(-0.16, -0.035),
        phase: p.random(p.TWO_PI),
      })
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    p.noStroke()

    for (let i = 0; i < lights.length; i++) {
      const light = lights[i]
      light.x += light.vx + Math.sin(t * 0.8 + light.phase) * 0.08
      light.y += light.vy
      if (light.x < -70) light.x = ctx.width + 70
      if (light.x > ctx.width + 70) light.x = -70
      if (light.y < -70) light.y = ctx.height + 70
      const radius = ctx.width * (0.018 + light.depth * 0.055)
      const color = p.color(i % 15 === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(18 + light.depth * 32)
      p.fill(color)
      p.circle(light.x, light.y, radius * 2.5)
      color.setAlpha(34 + light.depth * 58)
      p.fill(color)
      p.circle(light.x, light.y, radius * 1.72)
      p.noFill()
      color.setAlpha(70 + light.depth * 90)
      p.stroke(color)
      p.strokeWeight(1.2)
      p.circle(light.x, light.y, radius * 1.35)
      p.noStroke()
    }

    p.stroke(ctx.palette.paper)
    p.strokeWeight(1)
    p.line(ctx.width * 0.47, ctx.height * 0.5, ctx.width * 0.53, ctx.height * 0.5)
    p.line(ctx.width * 0.5, ctx.height * 0.47, ctx.width * 0.5, ctx.height * 0.53)
  }
}
