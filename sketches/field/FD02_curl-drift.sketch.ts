import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 1100
const SCALE = 0.003
const EPS = 1.4
const SPEED = 2.1

// Curl of a scalar noise potential: v = (dP/dy, -dP/dx). Divergence-free, so
// particles never pile up — they orbit instead.
export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const pts: { x: number; y: number }[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      pts.push({ x: p.random(p.width), y: p.random(p.height) })
    }
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(10)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    const z = p.frameCount * 0.0011

    for (let i = 0; i < pts.length; i++) {
      const pt = pts[i]!
      const sx = pt.x * SCALE
      const sy = pt.y * SCALE
      const gy = p.noise(sx, (pt.y + EPS) * SCALE, z) - p.noise(sx, (pt.y - EPS) * SCALE, z)
      const gx = p.noise((pt.x + EPS) * SCALE, sy, z) - p.noise((pt.x - EPS) * SCALE, sy, z)
      const m = Math.sqrt(gx * gx + gy * gy) + 1e-6
      const nx = pt.x + (gy / m) * SPEED
      const ny = pt.y - (gx / m) * SPEED

      const heat = p.constrain(m * 240, 0, 1)
      if (i % 89 === 0) {
        orange.setAlpha(50 + heat * 130)
        p.stroke(orange)
      } else {
        cyan.setAlpha(22 + heat * 110)
        p.stroke(cyan)
      }
      p.strokeWeight(0.5 + heat * 1.5)
      p.line(pt.x, pt.y, nx, ny)

      pt.x = nx
      pt.y = ny
      if (pt.x < 0 || pt.x > p.width || pt.y < 0 || pt.y > p.height || p.random() < 0.0025) {
        pt.x = p.random(p.width)
        pt.y = p.random(p.height)
      }
    }
  }
}
