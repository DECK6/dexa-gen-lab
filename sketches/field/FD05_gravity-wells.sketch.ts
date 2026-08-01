import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 520
const G = 300
const SOFT = 900
const VMAX = 7
const MAXAGE = 1500
const CAPTURE = 150 // squared radius: closer than this and the particle is eaten

interface Well {
  x: number
  y: number
  m: number
  r: number
  a: number
  w: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const wells: Well[] = []
  const px: number[] = []
  const py: number[] = []
  const vx: number[] = []
  const vy: number[] = []
  const age: number[] = []

  // A parallel beam, launched from off-canvas and slowly rotating. Coherent
  // aim is what makes the deflection legible as a trajectory.
  let beam = 0
  let launch = 0
  // `lead` starts a particle partway down the beam — used once at setup so the
  // field is already populated on frame 1.
  const spawn = (i: number, lead = 0) => {
    const dx = Math.cos(beam)
    const dy = Math.sin(beam)
    const off = p.random(-1, 1) * Math.max(p.width, p.height) * 0.55
    px[i] = p.width / 2 + dx * (lead - launch) - dy * off
    py[i] = p.height / 2 + dy * (lead - launch) + dx * off
    const s = p.random(2.9, 3.4)
    vx[i] = dx * s
    vy[i] = dy * s
    age[i] = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    const n = 3 + Math.floor(p.random(3))
    for (let k = 0; k < n; k++) {
      wells.push({
        x: 0,
        y: 0,
        m: p.random(0.7, 1.5),
        r: p.random(0.09, 0.3) * Math.min(p.width, p.height),
        a: p.random(p.TWO_PI),
        w: p.random(0.002, 0.005) * (p.random() < 0.5 ? -1 : 1),
      })
    }
    launch = Math.sqrt(p.width * p.width + p.height * p.height) * 0.52
    for (let i = 0; i < COUNT; i++) spawn(i, p.random(2 * launch))
    p.strokeWeight(1)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(16)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    beam = p.frameCount * 0.0016
    const cx = p.width / 2
    const cy = p.height / 2
    for (let k = 0; k < wells.length; k++) {
      const w = wells[k]!
      const ang = w.a + p.frameCount * w.w
      w.x = cx + Math.cos(ang) * w.r
      w.y = cy + Math.sin(ang) * w.r * 0.8
    }

    const cyan = p.color(pal.signal)
    for (let i = 0; i < COUNT; i++) {
      let ax = 0
      let ay = 0
      let near = 1e9
      for (let k = 0; k < wells.length; k++) {
        const w = wells[k]!
        const dx = w.x - px[i]!
        const dy = w.y - py[i]!
        const d2 = dx * dx + dy * dy
        if (d2 < near) near = d2
        const r2 = d2 + SOFT
        const inv = (G * w.m) / (r2 * Math.sqrt(r2))
        ax += dx * inv
        ay += dy * inv
      }
      const ox = px[i]!
      const oy = py[i]!
      let nvx = vx[i]! + ax
      let nvy = vy[i]! + ay
      const sp = Math.sqrt(nvx * nvx + nvy * nvy)
      if (sp > VMAX) {
        nvx = (nvx / sp) * VMAX
        nvy = (nvy / sp) * VMAX
      }
      vx[i] = nvx
      vy[i] = nvy
      px[i] = ox + nvx
      py[i] = oy + nvy
      age[i]!++

      cyan.setAlpha(58 + p.constrain((sp - 2) / 4, 0, 1) * 160)
      p.stroke(cyan)
      p.line(ox, oy, px[i]!, py[i]!)

      // Cull along the beam axis, not a box — particles are still inbound
      // long before they reach the canvas.
      const rx = px[i]! - cx
      const ry = py[i]! - cy
      const along = rx * Math.cos(beam) + ry * Math.sin(beam)
      const lat = ry * Math.cos(beam) - rx * Math.sin(beam)
      if (along > launch || Math.abs(lat) > launch || near < CAPTURE || age[i]! > MAXAGE) spawn(i)
    }

    const orange = p.color(pal.accent)
    orange.setAlpha(165)
    p.noFill()
    p.stroke(orange)
    p.strokeWeight(1.2)
    for (let k = 0; k < wells.length; k++) {
      const w = wells[k]!
      p.circle(w.x, w.y, w.m * 13 + Math.sin(p.frameCount * 0.06 + k) * 3)
    }
  }
}
