import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

// State = [theta1, theta2, omega1, omega2], equal masses/lengths, g = 1
type State = [number, number, number, number]

const H = 0.02
const SUB = 10

function deriv(s: State): State {
  const [a1, a2, w1, w2] = s
  const d = a1 - a2
  const den = 3 - Math.cos(2 * d)
  const dw1 =
    (-3 * Math.sin(a1) -
      Math.sin(a1 - 2 * a2) -
      2 * Math.sin(d) * (w2 * w2 + w1 * w1 * Math.cos(d))) /
    den
  const dw2 = (2 * Math.sin(d) * (2 * w1 * w1 + 2 * Math.cos(a1) + w2 * w2 * Math.cos(d))) / den
  return [w1, w2, dw1, dw2]
}

function shift(s: State, k: State, h: number): State {
  return [s[0] + k[0] * h, s[1] + k[1] * h, s[2] + k[2] * h, s[3] + k[3] * h]
}

function rk4(s: State, h: number): State {
  const k1 = deriv(s)
  const k2 = deriv(shift(s, k1, h / 2))
  const k3 = deriv(shift(s, k2, h / 2))
  const k4 = deriv(shift(s, k3, h))
  const w = h / 6
  return [
    s[0] + w * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    s[1] + w * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    s[2] + w * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
    s[3] + w * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]),
  ]
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let a: State = [0, 0, 0, 0]
  let b: State = [0, 0, 0, 0]
  let pa = { x: 0, y: 0 }
  let pb = { x: 0, y: 0 }
  let rod = 0
  let ox = 0
  let oy = 0
  let age = 0

  const tip = (s: State) => ({
    x: ox + rod * (Math.sin(s[0]) + Math.sin(s[1])),
    y: oy + rod * (Math.cos(s[0]) + Math.cos(s[1])),
  })

  // rods + bobs, drawn bright every frame so the rig reads immediately
  const rig = (s: State, end: { x: number; y: number }, tone: string, boost: number) => {
    const mx = ox + rod * Math.sin(s[0])
    const my = oy + rod * Math.cos(s[0])
    const arm = p.color(tone)
    arm.setAlpha(45 + 45 * boost)
    p.stroke(arm)
    p.strokeWeight(1.8)
    p.line(ox, oy, mx, my)
    p.line(mx, my, end.x, end.y)
    const bob = p.color(tone)
    bob.setAlpha(215)
    p.noStroke()
    p.fill(bob)
    p.circle(mx, my, 5)
    p.circle(end.x, end.y, 7.5)
  }

  const reseed = () => {
    const t1 = p.random(p.PI * 0.55, p.PI * 1.45)
    const t2 = p.random(p.PI * 0.35, p.PI * 1.65)
    a = [t1, t2, 0, 0]
    b = [t1 + 4e-5, t2, 0, 0] // one part in 10^5 — the whole point
    pa = tip(a)
    pb = tip(b)
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    rod = Math.min(p.width, p.height) * 0.2
    ox = p.width / 2
    oy = p.height * 0.4
    p.strokeWeight(1)
    reseed()
  }

  p.draw = () => {
    // first frames run hot so the web is legible within a second
    const boost = p.constrain(1 - (p.frameCount - 100) / 300, 0, 1)

    const veil = p.color(pal.bg)
    veil.setAlpha(3 - boost)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cyan = p.color(pal.signal)
    cyan.setAlpha(42 + 34 * boost)
    const orange = p.color(pal.accent)
    orange.setAlpha(42 + 34 * boost)

    p.strokeWeight(1.5)
    for (let i = 0; i < SUB; i++) {
      a = rk4(a, H)
      b = rk4(b, H)
      const na = tip(a)
      const nb = tip(b)
      p.stroke(cyan)
      p.line(pa.x, pa.y, na.x, na.y)
      p.stroke(orange)
      p.line(pb.x, pb.y, nb.x, nb.y)
      pa = na
      pb = nb
    }
    age++

    rig(a, pa, pal.signal, boost)
    rig(b, pb, pal.accent, boost)
    p.strokeWeight(1)

    if (!Number.isFinite(a[2]) || Math.abs(a[2]) > 60 || age > 1500) reseed()
  }
}
