import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 360

interface Mote {
  x: number
  y: number
  vx: number
  vy: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const motes: Mote[] = []
  let gravity = 0
  let core = 0

  const eject = (o: Mote) => {
    const a = p.random(p.TWO_PI)
    const r = p.random(p.width * 0.2, p.width * 0.47)
    const v = Math.sqrt(gravity / r) * p.random(0.62, 0.88)
    o.x = p.width / 2 + Math.cos(a) * r
    o.y = p.height / 2 + Math.sin(a) * r
    o.vx = -Math.sin(a) * v + p.random(-0.2, 0.2)
    o.vy = Math.cos(a) * v + p.random(-0.2, 0.2)
    o.hot = p.random() < 0.055
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    gravity = p.width * p.width * 0.012
    core = p.width * 0.026
    for (let i = 0; i < COUNT; i++) {
      const o: Mote = { x: 0, y: 0, vx: 0, vy: 0, hot: false }
      eject(o)
      motes.push(o)
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(12)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cx = p.width / 2
    const cy = p.height / 2
    const cyan = p.color(pal.signal)
    cyan.setAlpha(70)
    const orange = p.color(pal.accent)
    orange.setAlpha(165)
    p.strokeWeight(1)
    for (let i = 0; i < motes.length; i++) {
      const o = motes[i]
      const dx = cx - o.x
      const dy = cy - o.y
      const d2 = dx * dx + dy * dy + core * core
      const pull = gravity / (d2 * Math.sqrt(d2))
      o.vx = (o.vx + dx * pull) * 0.991
      o.vy = (o.vy + dy * pull) * 0.991
      const nx = o.x + o.vx
      const ny = o.y + o.vy
      p.stroke(o.hot ? orange : cyan)
      p.line(o.x, o.y, nx, ny)
      o.x = nx
      o.y = ny
      if (Math.hypot(dx, dy) < core * 1.2 || Math.hypot(dx, dy) > p.width * 0.7) eject(o)
    }

    const ring = p.color(pal.accent)
    ring.setAlpha(90)
    p.noFill()
    p.stroke(ring)
    p.ellipse(cx, cy, core * (1.8 + 0.25 * Math.sin(p.frameCount * 0.12)))
  }
}
