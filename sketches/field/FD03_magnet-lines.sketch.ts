import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const LINES = 28
const STEPS = 320
const STEP = 2.6
const SOFT = 60

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let cx = 0
  let cy = 0
  let orbit = 0
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    cx = p.width / 2
    cy = p.height / 2
    orbit = Math.min(p.width, p.height) * 0.2
    phase = p.random(p.TWO_PI)
    p.strokeWeight(1)
  }

  // Trace one field line of the dipole from (x0, y0) until it reaches the
  // S pole or leaves the canvas.
  const trace = (x0: number, y0: number, nx: number, ny: number, sx: number, sy: number) => {
    let x = x0
    let y = y0
    p.beginShape()
    p.vertex(x, y)
    for (let s = 0; s < STEPS; s++) {
      const dxn = x - nx
      const dyn = y - ny
      const rn = dxn * dxn + dyn * dyn + SOFT
      const kn = 1 / (rn * Math.sqrt(rn))
      const dxs = x - sx
      const dys = y - sy
      const rs = dxs * dxs + dys * dys + SOFT
      const ks = 1 / (rs * Math.sqrt(rs))
      const bx = dxn * kn - dxs * ks
      const by = dyn * kn - dys * ks
      const m = Math.sqrt(bx * bx + by * by) + 1e-12
      x += (bx / m) * STEP
      y += (by / m) * STEP
      p.vertex(x, y)
      if (x < -40 || x > p.width + 40 || y < -40 || y > p.height + 40) break
      if (dxs * dxs + dys * dys < 100) break
    }
    p.endShape()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(46)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const t = p.frameCount * 0.0055 + phase
    const nx = cx + Math.cos(t) * orbit
    const ny = cy + Math.sin(t) * orbit * 0.6
    const sx = cx - Math.cos(t) * orbit
    const sy = cy - Math.sin(t) * orbit * 0.6

    const cyan = p.color(pal.signal)
    cyan.setAlpha(96)
    const orange = p.color(pal.accent)
    orange.setAlpha(150)

    p.noFill()
    for (let i = 0; i < LINES; i++) {
      const a = (i / LINES) * p.TWO_PI + t * 0.35
      p.stroke(i % 7 === 0 ? orange : cyan)
      p.strokeWeight(i % 7 === 0 ? 1.3 : 0.9)
      trace(nx + Math.cos(a) * 11, ny + Math.sin(a) * 11, nx, ny, sx, sy)
    }

    const dim = p.color(pal.dim)
    dim.setAlpha(170)
    p.strokeWeight(1.4)
    p.stroke(orange)
    p.circle(nx, ny, 15 + Math.sin(p.frameCount * 0.05) * 2)
    p.stroke(dim)
    p.circle(sx, sy, 15 + Math.sin(p.frameCount * 0.05 + p.PI) * 2)
  }
}
