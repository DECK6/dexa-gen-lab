import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const RINGS = 9
const SAMPLES = 220
const MIN_SIDES = 3
const SIDE_SPAN = 6

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const spin: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    for (let k = 0; k < RINGS; k++) spin.push(p.random(-1, 1) * 0.004 + (k % 2 ? 0.002 : -0.002))
  }

  // point at perimeter fraction u on a regular n-gon of unit circumradius
  const corner = (n: number, u: number, rot: number, out: number[]) => {
    const e = p.floor(u * n)
    const f = u * n - e
    const a0 = (e / n) * p.TWO_PI + rot
    const a1 = ((e + 1) / n) * p.TWO_PI + rot
    out[0] = p.lerp(p.cos(a0), p.cos(a1), f)
    out[1] = p.lerp(p.sin(a0), p.sin(a1), f)
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.006
    const cx = p.width / 2
    const cy = p.height / 2
    const lo: number[] = [0, 0]
    const hi: number[] = [0, 0]

    for (let k = 0; k < RINGS; k++) {
      const rad = (p.min(p.width, p.height) * 0.46 * (k + 1.4)) / (RINGS + 1.4)
      const sides = MIN_SIDES + ((t * 2.2 + k * 0.85) % SIDE_SPAN)
      const n0 = p.floor(sides)
      const mix = sides - n0
      const rot = p.frameCount * spin[k]! + k * 0.21

      const hot = k === RINGS - 1 || k === 2
      const line = p.color(hot ? pal.accent : pal.signal)
      line.setAlpha(hot ? 165 : 90 + 70 * p.sin(t * 3 + k))
      p.stroke(line)
      p.strokeWeight(hot ? 1.5 : 1.05)

      p.beginShape()
      for (let s = 0; s < SAMPLES; s++) {
        const u = s / SAMPLES
        corner(n0, u, rot, lo)
        corner(n0 + 1, u, rot, hi)
        p.vertex(cx + p.lerp(lo[0]!, hi[0]!, mix) * rad, cy + p.lerp(lo[1]!, hi[1]!, mix) * rad)
      }
      p.endShape(p.CLOSE)

      // vertex ticks of the dominant polygon
      const tick = p.color(pal.dim)
      tick.setAlpha(150)
      p.stroke(tick)
      p.strokeWeight(1)
      const nv = mix < 0.5 ? n0 : n0 + 1
      for (let v = 0; v < nv; v++) {
        const a = (v / nv) * p.TWO_PI + rot
        p.line(cx + p.cos(a) * rad * 0.97, cy + p.sin(a) * rad * 0.97, cx + p.cos(a) * rad * 1.05, cy + p.sin(a) * rad * 1.05)
      }
    }
  }
}
