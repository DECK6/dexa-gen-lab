import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 880

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const theta: number[] = []
  const axial: number[] = []
  const radius: number[] = []
  const spin: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      theta.push(p.random(p.TWO_PI))
      axial.push(p.random(-1, 1))
      radius.push(p.random(22, Math.min(p.width, p.height) * 0.22))
      spin.push(p.random(0.018, 0.038))
    }
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(22)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    const dim = p.color(pal.dim)
    dim.setAlpha(80)
    p.stroke(dim)
    p.strokeWeight(1)
    p.line(p.width * 0.07, p.height / 2, p.width * 0.93, p.height / 2)

    for (let i = 0; i < COUNT; i++) {
      const a0 = theta[i]!
      const z0 = axial[i]!
      const a1 = a0 + spin[i]!
      let z1 = z0 + 0.0038 + spin[i]! * 0.045
      const r = radius[i]!
      const d0 = Math.sin(a0) * r
      const d1 = Math.sin(a1) * r
      const q0 = 1 / (1 + d0 / p.height * 0.9)
      const q1 = 1 / (1 + d1 / p.height * 0.9)
      const x0 = p.width / 2 + z0 * p.width * 0.43 * q0
      const y0 = p.height / 2 + Math.cos(a0) * r * q0
      const x1 = p.width / 2 + z1 * p.width * 0.43 * q1
      const y1 = p.height / 2 + Math.cos(a1) * r * q1
      const near = p.constrain(0.5 + d1 / r * 0.5, 0, 1)
      const hot = i % 97 === 0
      const col = hot ? orange : cyan
      col.setAlpha((hot ? 100 : 28) + near * (hot ? 130 : 120))
      p.stroke(col)
      p.strokeWeight(0.55 + near * (hot ? 1.7 : 1))
      if (z1 <= 1) p.line(x0, y0, x1, y1)
      if (z1 > 1) z1 = -1
      theta[i] = a1
      axial[i] = z1
    }
  }
}
