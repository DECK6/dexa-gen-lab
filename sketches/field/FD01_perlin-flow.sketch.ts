import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 900
const STEP = 1.6

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const pts: { x: number; y: number }[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      pts.push({ x: p.random(p.width), y: p.random(p.height) })
    }
    p.strokeWeight(1)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(12)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cyan = p.color(pal.signal)
    cyan.setAlpha(70)
    const orange = p.color(pal.accent)
    orange.setAlpha(90)

    const z = p.frameCount * 0.0015
    for (let i = 0; i < pts.length; i++) {
      const pt = pts[i]!
      const a = p.noise(pt.x * 0.0038, pt.y * 0.0038, z) * p.TWO_PI * 2
      const nx = pt.x + Math.cos(a) * STEP
      const ny = pt.y + Math.sin(a) * STEP
      p.stroke(i % 97 === 0 ? orange : cyan)
      p.line(pt.x, pt.y, nx, ny)
      pt.x = nx
      pt.y = ny
      if (pt.x < 0 || pt.x > p.width || pt.y < 0 || pt.y > p.height || p.random() < 0.004) {
        pt.x = p.random(p.width)
        pt.y = p.random(p.height)
      }
    }
  }
}
