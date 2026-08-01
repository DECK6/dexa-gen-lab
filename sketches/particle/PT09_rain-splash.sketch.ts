import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const DROPS = 120
const MAX_SPRAY = 640
const RINGS = 40
const GRAV = 0.3

interface Drop {
  x: number
  y: number
  v: number
  len: number
}

interface Spray {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

interface Ring {
  x: number
  age: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const rain: Drop[] = []
  const spray: Spray[] = []
  const rings: Ring[] = []
  let ri = 0
  let floorY = 0

  const reset = (d: Drop) => {
    d.x = p.random(-p.width * 0.1, p.width * 1.1)
    d.y = -p.random(p.height * 0.5)
    d.v = p.random(6, 11)
    d.len = d.v * p.random(1.6, 2.8)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    floorY = p.height * 0.8
    for (let i = 0; i < DROPS; i++) {
      const d: Drop = { x: 0, y: 0, v: 0, len: 0 }
      reset(d)
      d.y = p.random(-p.height, floorY)
      rain.push(d)
    }
    for (let i = 0; i < RINGS; i++) rings.push({ x: 0, age: 99, hot: false })
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(30)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const f = p.frameCount
    const slant = (p.noise(f * 0.0021) - 0.5) * 3.4

    const line = p.color(pal.signal)
    line.setAlpha(120)
    p.stroke(line)
    p.strokeWeight(1)
    for (let i = 0; i < DROPS; i++) {
      const d = rain[i]
      d.y += d.v
      d.x += slant
      p.line(d.x - slant * (d.len / d.v), d.y - d.len, d.x, d.y)
      if (d.y < floorY) continue
      const hot = p.random() < 0.12
      const n = Math.floor(p.random(4, 8))
      for (let k = 0; k < n && spray.length < MAX_SPRAY; k++) {
        spray.push({
          x: d.x,
          y: floorY,
          vx: p.random(-2.6, 2.6) + slant * 0.4,
          vy: p.random(-4.2, -1.4),
          life: p.random(20, 40),
        })
      }
      const rg = rings[ri]
      rg.x = d.x
      rg.age = 0
      rg.hot = hot
      ri = (ri + 1) % RINGS
      reset(d)
    }

    const bead = p.color(pal.signal)
    p.noStroke()
    for (let i = spray.length - 1; i >= 0; i--) {
      const s = spray[i]
      s.vy += GRAV
      s.x += s.vx
      s.y += s.vy
      s.life--
      if (s.life <= 0 || (s.y > floorY && s.vy > 0)) {
        spray[i] = spray[spray.length - 1]
        spray.pop()
        continue
      }
      bead.setAlpha(Math.min(s.life * 8, 200))
      p.fill(bead)
      p.ellipse(s.x, s.y, 2)
    }

    p.noFill()
    const wave = p.color(pal.signal)
    const flare = p.color(pal.accent)
    for (let i = 0; i < RINGS; i++) {
      const rg = rings[i]
      if (rg.age > 26) continue
      const k = 1 - rg.age / 26
      const c = rg.hot ? flare : wave
      c.setAlpha(k * (rg.hot ? 200 : 110))
      p.stroke(c)
      p.strokeWeight(1)
      p.ellipse(rg.x, floorY, rg.age * 4.4, rg.age * 1.5)
      rg.age++
    }

    const deck = p.color(pal.dim)
    deck.setAlpha(150)
    p.stroke(deck)
    p.strokeWeight(1)
    p.line(0, floorY, p.width, floorY)
  }
}
