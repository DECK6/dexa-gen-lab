import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 720

interface Orb {
  x: number
  y: number
  vx: number
  vy: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const orbs: Orb[] = []
  let g = 0
  let soft = 0

  // Place on a near-circular orbit: v = sqrt(G r² / (r²+s²)^1.5) for a Plummer core.
  const respawn = (o: Orb, cx: number, cy: number) => {
    const a = p.random(p.TWO_PI)
    const r = p.random(p.width * 0.1, p.width * 0.45)
    const d2 = r * r + soft * soft
    const v = Math.sqrt((g * r * r) / (d2 * Math.sqrt(d2))) * p.random(0.82, 1.1)
    o.x = cx + Math.cos(a) * r
    o.y = cy + Math.sin(a) * r
    o.vx = -Math.sin(a) * v
    o.vy = Math.cos(a) * v
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    g = p.width * p.width * 0.0083
    soft = p.width * 0.07
    for (let i = 0; i < COUNT; i++) {
      const o: Orb = { x: 0, y: 0, vx: 0, vy: 0, hot: i % 43 === 0 }
      respawn(o, p.width / 2, p.height / 2)
      orbs.push(o)
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(13)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cyan = p.color(pal.signal)
    cyan.setAlpha(56)
    const orange = p.color(pal.accent)
    orange.setAlpha(130)

    const f = p.frameCount
    const cx = p.width / 2 + Math.sin(f * 0.0037) * p.width * 0.04
    const cy = p.height / 2 + Math.cos(f * 0.0029) * p.height * 0.04
    const bail = p.width * 0.62

    p.strokeWeight(1)
    for (let i = 0; i < orbs.length; i++) {
      const o = orbs[i]
      const dx = cx - o.x
      const dy = cy - o.y
      const d2 = dx * dx + dy * dy + soft * soft
      const pull = g / (d2 * Math.sqrt(d2))
      o.vx += dx * pull
      o.vy += dy * pull
      const nx = o.x + o.vx
      const ny = o.y + o.vy
      p.stroke(o.hot ? orange : cyan)
      p.line(o.x, o.y, nx, ny)
      o.x = nx
      o.y = ny
      if (p.dist(nx, ny, cx, cy) > bail || p.random() < 0.0016) respawn(o, cx, cy)
    }

    // attractor readout: breathing ring at the focus
    const ring = p.color(pal.accent)
    ring.setAlpha(90)
    p.noFill()
    p.stroke(ring)
    p.strokeWeight(1.2)
    p.ellipse(cx, cy, 14 + Math.sin(f * 0.05) * 4)
  }
}
