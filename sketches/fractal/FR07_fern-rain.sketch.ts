import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Drop {
  x: number
  y: number
  ty: number
  v: number
}

const DUST = 2200 // IFS points deposited per frame
const DROPS = 240
const GRAVITY = 0.34

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const drops: Drop[] = []
  let fx = 0
  let fy = 0
  let sc = 1
  let ox = 0
  let oy = 0

  // Barnsley fern IFS — one step of the walker.
  const step = () => {
    const r = p.random()
    let nx: number
    let ny: number
    if (r < 0.01) {
      nx = 0
      ny = 0.16 * fy
    } else if (r < 0.86) {
      nx = 0.85 * fx + 0.04 * fy
      ny = -0.04 * fx + 0.85 * fy + 1.6
    } else if (r < 0.93) {
      nx = 0.2 * fx - 0.26 * fy
      ny = 0.23 * fx + 0.22 * fy + 1.6
    } else {
      nx = -0.15 * fx + 0.28 * fy
      ny = 0.26 * fx + 0.24 * fy + 0.44
    }
    fx = nx
    fy = ny
  }

  const sx = () => ox + fx * sc
  const sy = () => oy - fy * sc

  const respawn = (d: Drop) => {
    step()
    d.x = sx()
    d.ty = sy()
    d.y = -p.random(30, p.height * 0.7)
    d.v = p.random(0.6, 2.4)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    sc = p.height / 11.4
    ox = p.width / 2 + p.random(-14, 14)
    oy = p.height - p.height * 0.035
    for (let i = 0; i < 60; i++) step()
    for (let i = 0; i < DROPS; i++) {
      const d: Drop = { x: 0, y: 0, ty: 0, v: 0 }
      respawn(d)
      d.y = -p.random(p.height)
      drops.push(d)
    }
    p.strokeWeight(1)
  }

  p.draw = () => {
    if (p.frameCount % 3 === 0) {
      const c = p.color(pal.bg)
      c.setAlpha(4)
      p.noStroke()
      p.fill(c)
      p.rect(0, 0, p.width, p.height)
    }

    const cyan = p.color(pal.signal)
    cyan.setAlpha(52)
    const orange = p.color(pal.accent)
    orange.setAlpha(120)
    p.stroke(cyan)
    p.strokeWeight(1)
    for (let i = 0; i < DUST; i++) {
      step()
      if (i % 311 === 0) {
        p.stroke(orange)
        p.point(sx(), sy())
        p.stroke(cyan)
      } else {
        p.point(sx(), sy())
      }
    }

    const streak = p.color(pal.dim)
    streak.setAlpha(130)
    const land = p.color(pal.paper)
    land.setAlpha(90)
    for (const d of drops) {
      d.v += GRAVITY
      d.y += d.v
      p.stroke(streak)
      p.line(d.x, d.y - Math.min(20, d.v * 2.6), d.x, d.y)
      if (d.y >= d.ty) {
        p.stroke(land)
        p.strokeWeight(1.8)
        p.point(d.x, d.ty)
        p.strokeWeight(1)
        respawn(d)
      }
    }
  }
}
