import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 480

type Pollen = { x: number; y: number; vx: number; vy: number; r: number; rest: number; landed: number; hot: boolean }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const grains: Pollen[] = []
  let ground = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    ground = p.height * 0.88
    for (let i = 0; i < COUNT; i++) {
      grains.push({ x: p.random(p.width), y: p.random(p.height * 0.06, ground), vx: p.random(-0.5, 0.5), vy: p.random(-0.4, 0.4), r: p.random(1.1, 2.7), rest: p.random(80, 220), landed: 0, hot: p.random() < 0.025 })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const gust = (p.noise(p.frameCount * 0.006, 20) - 0.38) * 0.12
    const grain = p.color(pal.signal)
    const hot = p.color(pal.accent)
    const floor = p.color(pal.dim)
    floor.setAlpha(90)
    p.stroke(floor)
    p.strokeWeight(1)
    p.line(p.width * 0.05, ground, p.width * 0.95, ground)
    for (const g of grains) {
      const ox = g.x
      const oy = g.y
      if (g.landed > 0) {
        g.landed++
        if (g.landed > g.rest && gust > 0.025) {
          g.landed = 0
          g.vx = gust * p.random(12, 22)
          g.vy = p.random(-2.4, -0.8)
        }
      } else {
        const turbulence = (p.noise(g.x * 0.009, g.y * 0.009, p.frameCount * 0.004) - 0.5) * 0.07
        g.vx = g.vx * 0.975 + gust + turbulence
        g.vy = g.vy * 0.982 + 0.018 - turbulence * 0.45
        g.x += g.vx
        g.y += g.vy
        if (g.y >= ground) {
          g.y = ground
          g.vx *= 0.12
          g.vy = 0
          g.landed = 1
        }
        if (g.x > p.width + 8) g.x = -8
        if (g.x < -8) g.x = p.width + 8
        if (g.y < -8) g.y = ground
      }
      const col = g.hot ? hot : grain
      col.setAlpha(g.hot ? 220 : 120 + g.r * 35)
      p.stroke(col)
      p.strokeWeight(0.7)
      if (g.landed === 0) p.line(ox, oy, g.x, g.y)
      p.noFill()
      p.ellipse(g.x, g.y, g.r * 2.4)
      p.point(g.x, g.y)
    }
  }
}
