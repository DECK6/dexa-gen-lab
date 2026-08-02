import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 280

interface Speck {
  x: number
  y: number
  vx: number
  vy: number
  wall: number
  hold: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const specks: Speck[] = []

  const release = (o: Speck) => {
    if (o.wall === 1) o.vy = 2.4
    else if (o.wall === 2) o.vx = -2.4
    else if (o.wall === 3) o.vy = -2.4
    else o.vx = 2.4
    o.wall = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      specks.push({ x: p.random(p.width), y: p.random(p.height), vx: p.random(-1, 1), vy: p.random(-1, 1), wall: 0, hold: 0 })
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(34)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const f = p.frameCount
    const chargeX = p.width * (0.5 + 0.42 * Math.sin(f * 0.008))
    const chargeY = p.height * (0.5 + 0.42 * Math.sin(f * 0.011 + 1.4))
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    p.strokeWeight(1)
    for (let i = 0; i < specks.length; i++) {
      const o = specks[i]
      if (o.wall === 0) {
        const distances = [o.y, p.width - o.x, p.height - o.y, o.x]
        let wall = 1
        for (let k = 1; k < 4; k++) if (distances[k] < distances[wall - 1]) wall = k + 1
        const force = 0.035 + 0.2 / Math.max(distances[wall - 1], 8)
        if (wall === 1) o.vy -= force
        else if (wall === 2) o.vx += force
        else if (wall === 3) o.vy += force
        else o.vx -= force
        const curl = p.noise(o.x * 0.008, o.y * 0.008, f * 0.003) * p.TWO_PI * 2
        o.vx = (o.vx + Math.cos(curl) * 0.025) * 0.99
        o.vy = (o.vy + Math.sin(curl) * 0.025) * 0.99
        o.x += o.vx
        o.y += o.vy
        if (distances[wall - 1] < 4) {
          o.wall = wall
          o.hold = p.random(45, 150)
          o.x = p.constrain(o.x, 3, p.width - 3)
          o.y = p.constrain(o.y, 3, p.height - 3)
        }
      } else {
        o.hold--
        const slide = Math.sin(f * 0.035 + i) * 0.35
        if (o.wall === 1 || o.wall === 3) o.x = p.constrain(o.x + slide, 3, p.width - 3)
        else o.y = p.constrain(o.y + slide, 3, p.height - 3)
        if (o.hold <= 0) release(o)
      }
      cyan.setAlpha(o.wall === 0 ? 105 : 210)
      orange.setAlpha(210)
      p.stroke(i % 41 === 0 ? orange : cyan)
      p.line(o.x, o.y, o.x - o.vx * 3, o.y - o.vy * 3)
      p.point(o.x, o.y)
    }

    const charge = p.color(pal.accent)
    charge.setAlpha(120)
    p.noFill()
    p.stroke(charge)
    p.ellipse(chargeX, chargeY, 12 + Math.sin(f * 0.1) * 4)
  }
}
