import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Droplet {
  x: number
  y: number
  r: number
  vy: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const droplets: Droplet[] = []

  function reset(drop: Droplet, scatter: boolean) {
    drop.x = p.random(ctx.width * 0.06, ctx.width * 0.94)
    drop.y = scatter ? p.random(ctx.height) : p.random(-30, 0)
    drop.r = p.random(3, 9)
    drop.vy = p.random(0.03, 0.25)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 44; i++) {
      const drop = { x: 0, y: 0, r: 0, vy: 0 }
      reset(drop, true)
      droplets.push(drop)
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const f = p.frameCount
    for (const drop of droplets) {
      drop.r = Math.min(28, drop.r + 0.004)
      drop.vy = (drop.vy + 0.007 + drop.r * 0.0015) * 0.992
      drop.x += (p.noise(drop.x * 0.012, drop.y * 0.009, f * 0.004) - 0.5) * 0.75
      drop.y += drop.vy
      if (drop.y - drop.r > ctx.height) reset(drop, false)
    }

    for (let i = 0; i < droplets.length; i++) {
      const a = droplets[i]
      for (let j = i + 1; j < droplets.length; j++) {
        const b = droplets[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        if (dx * dx + dy * dy > (a.r + b.r) * (a.r + b.r) * 0.5) continue
        const large = a.r >= b.r ? a : b
        const small = a.r >= b.r ? b : a
        const area = large.r * large.r + small.r * small.r
        large.x = (large.x * large.r * large.r + small.x * small.r * small.r) / area
        large.y = (large.y * large.r * large.r + small.y * small.r * small.r) / area
        large.r = Math.min(34, Math.sqrt(area))
        large.vy = Math.max(large.vy, small.vy) + 0.08
        reset(small, false)
      }
    }

    p.noFill()
    for (const drop of droplets) {
      const color = p.color(drop.r > 18 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(drop.r > 18 ? 190 : 145)
      p.stroke(color)
      p.strokeWeight(Math.min(2.4, 0.7 + drop.r * 0.06))
      p.line(drop.x, drop.y - drop.r, drop.x, drop.y - drop.r - drop.vy * 9)
      p.circle(drop.x, drop.y, drop.r * 2)
      const sheen = p.color(ctx.palette.paper)
      sheen.setAlpha(105)
      p.stroke(sheen)
      p.arc(drop.x, drop.y, drop.r * 1.25, drop.r * 1.25, p.PI, p.PI * 1.55)
    }
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    p.line(ctx.width * 0.04, 0, ctx.width * 0.04, ctx.height)
    p.line(ctx.width * 0.96, 0, ctx.width * 0.96, ctx.height)
  }
}
