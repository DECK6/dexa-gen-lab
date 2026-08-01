import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 220
const LINK_R = 96 // coupling radius
const COUPLE = 0.085 // phase kick a neighbour receives from a flash
const PERIOD = 132 // frames per cycle at nominal rate
const SCATTER = 780 // frames between phase re-scatters

interface Fly {
  hx: number
  hy: number
  ph: number
  sp: number
  flash: number
  nb: number[]
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const flies: Fly[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    const cols = Math.round(Math.sqrt(N))
    for (let i = 0; i < N; i++) {
      const gx = (i % cols) / (cols - 1)
      const gy = Math.floor(i / cols) / cols
      flies.push({
        hx: p.width * (0.07 + gx * 0.86) + p.random(-14, 14),
        hy: p.height * (0.07 + gy * 0.86) + p.random(-14, 14),
        ph: p.random(),
        sp: (1 / PERIOD) * p.random(0.92, 1.08),
        flash: 0,
        nb: [],
      })
    }
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (i === j) continue
        const a = flies[i]
        const b = flies[j]
        if (p.dist(a.hx, a.hy, b.hx, b.hy) < LINK_R) a.nb.push(j)
      }
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(34)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const f = p.frameCount
    if (f % SCATTER === 0) {
      for (let i = 0; i < N; i++) flies[i].ph = p.random()
    }

    // integrate-and-fire: crossing 1 resets the phase and nudges every neighbour up
    for (let i = 0; i < N; i++) {
      const o = flies[i]
      o.flash *= 0.88
      o.ph += o.sp
      if (o.ph >= 1) {
        o.ph = 0
        o.flash = 1
        for (let k = 0; k < o.nb.length; k++) {
          const b = flies[o.nb[k]]
          if (b.ph > 0.02) b.ph = Math.min(0.999, b.ph + COUPLE)
        }
      }
    }

    // Kuramoto order parameter drives the meter and the flash colour
    let sx = 0
    let sy = 0
    for (let i = 0; i < N; i++) {
      sx += Math.cos(flies[i].ph * p.TWO_PI)
      sy += Math.sin(flies[i].ph * p.TWO_PI)
    }
    const order = Math.hypot(sx, sy) / N

    const idle = p.color(pal.dim)
    idle.setAlpha(150)
    for (let i = 0; i < N; i++) {
      const o = flies[i]
      const wob = f * 0.004 + i
      const x = o.hx + (p.noise(wob, i * 0.31) - 0.5) * 10
      const y = o.hy + (p.noise(i * 0.27, wob) - 0.5) * 10
      p.noStroke()
      p.fill(idle)
      p.ellipse(x, y, 2)
      if (o.flash > 0.05) {
        const glow = p.color(order > 0.8 ? pal.accent : pal.signal)
        glow.setAlpha(o.flash * 210)
        p.noFill()
        p.stroke(glow)
        p.strokeWeight(1)
        p.ellipse(x, y, 4 + (1 - o.flash) * 16)
        glow.setAlpha(o.flash * 255)
        p.fill(glow)
        p.noStroke()
        p.ellipse(x, y, 3.4)
      }
    }

    // sync meter, bottom-left
    const mw = p.width * 0.26
    const mx = p.width * 0.06
    const my = p.height * 0.94
    const track = p.color(pal.dim)
    track.setAlpha(120)
    p.stroke(track)
    p.strokeWeight(1)
    p.line(mx, my, mx + mw, my)
    for (let t = 0; t <= 4; t++) p.line(mx + (mw * t) / 4, my - 3, mx + (mw * t) / 4, my)
    const lit = p.color(pal.accent)
    lit.setAlpha(220)
    p.stroke(lit)
    p.strokeWeight(2)
    p.line(mx, my, mx + mw * order, my)
  }
}
