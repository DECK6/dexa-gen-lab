import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SUB = 10
const DT = 0.006
const EPS2 = 0.0045
const ESCAPE = 4
const LIFE = 2400

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const bx = [0, 0, 0]
  const by = [0, 0, 0]
  const bvx = [0, 0, 0]
  const bvy = [0, 0, 0]
  const lx = [0, 0, 0]
  const ly = [0, 0, 0]
  let scale = 0
  let cx = 0
  let cy = 0
  let age = 0

  const reseed = () => {
    let mx = 0
    let my = 0
    let mvx = 0
    let mvy = 0
    for (let k = 0; k < 3; k++) {
      const ang = p.random(p.TWO_PI)
      const r = p.random(0.55, 1.25)
      const sp = p.random(0.45, 0.95)
      bx[k] = Math.cos(ang) * r
      by[k] = Math.sin(ang) * r
      bvx[k] = -Math.sin(ang) * sp
      bvy[k] = Math.cos(ang) * sp
      mx += bx[k] / 3
      my += by[k] / 3
      mvx += bvx[k] / 3
      mvy += bvy[k] / 3
    }
    // drop to the barycentric frame so the system stays on screen
    for (let k = 0; k < 3; k++) {
      bx[k] -= mx
      by[k] -= my
      bvx[k] -= mvx
      bvy[k] -= mvy
      lx[k] = cx + bx[k] * scale
      ly[k] = cy + by[k] * scale
    }
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    scale = Math.min(p.width, p.height) * 0.28
    cx = p.width / 2
    cy = p.height / 2
    p.strokeWeight(1)
    reseed()
  }

  p.draw = () => {
    // first frames run hot so a full orbit is on screen within a second
    const boost = p.constrain(1 - (p.frameCount - 100) / 300, 0, 1)

    const veil = p.color(pal.bg)
    veil.setAlpha(2 - boost)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const trails = [p.color(pal.signal), p.color(pal.signal), p.color(pal.paper)]
    trails[0].setAlpha(Math.min(255, 86 + 40 * boost))
    trails[1].setAlpha(Math.min(255, 60 + 30 * boost))
    trails[2].setAlpha(Math.min(255, 42 + 24 * boost))
    p.strokeWeight(1.5)

    for (let n = 0; n < SUB; n++) {
      for (let k = 0; k < 3; k++) {
        let ax = 0
        let ay = 0
        for (let j = 0; j < 3; j++) {
          if (j === k) continue
          const dx = bx[j] - bx[k]
          const dy = by[j] - by[k]
          const r2 = dx * dx + dy * dy + EPS2
          const inv = 1 / (r2 * Math.sqrt(r2))
          ax += dx * inv
          ay += dy * inv
        }
        bvx[k] += ax * DT
        bvy[k] += ay * DT
      }
      for (let k = 0; k < 3; k++) {
        bx[k] += bvx[k] * DT
        by[k] += bvy[k] * DT
        const qx = cx + bx[k] * scale
        const qy = cy + by[k] * scale
        p.stroke(trails[k])
        p.line(lx[k], ly[k], qx, qy)
        lx[k] = qx
        ly[k] = qy
      }
    }
    age++

    const head = p.color(pal.accent)
    head.setAlpha(215)
    p.noStroke()
    p.fill(head)
    for (let k = 0; k < 3; k++) p.circle(lx[k], ly[k], 8)
    p.strokeWeight(1)

    let escaped = age > LIFE
    for (let k = 0; k < 3; k++) {
      if (!Number.isFinite(bx[k]) || Math.hypot(bx[k], by[k]) > ESCAPE) escaped = true
    }
    if (escaped) reseed()
  }
}
