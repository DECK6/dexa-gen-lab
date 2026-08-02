import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SIDES = 7
const CHAINS = 9

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    phase = p.random(1)
  }

  p.draw = () => {
    p.background(pal.bg)
    p.translate(p.width / 2, p.height / 2)
    const radius = p.min(p.width, p.height) * 0.42
    const rot = -p.HALF_PI

    const frame = p.color(pal.dim)
    frame.setAlpha(105)
    p.stroke(frame)
    p.strokeWeight(1)
    p.beginShape()
    for (let i = 0; i < SIDES; i++) {
      const a = (i / SIDES) * p.TWO_PI + rot
      p.vertex(p.cos(a) * radius, p.sin(a) * radius)
    }
    p.endShape(p.CLOSE)

    for (let chain = 0; chain < CHAINS; chain++) {
      const hot = chain === 2
      const line = p.color(hot ? pal.accent : pal.signal)
      line.setAlpha(hot ? 205 : 50 + chain * 8)
      p.stroke(line)
      p.strokeWeight(hot ? 1.7 : 1)
      p.beginShape()
      for (let i = 0; i < SIDES; i++) {
        const a0 = (i / SIDES) * p.TWO_PI + rot
        const a1 = ((i + 1) / SIDES) * p.TWO_PI + rot
        const u = (p.frameCount * 0.006 + phase + chain / CHAINS + i * 0.055) % 1
        const x = p.lerp(p.cos(a0), p.cos(a1), u) * radius
        const y = p.lerp(p.sin(a0), p.sin(a1), u) * radius
        p.vertex(x, y)
      }
      p.endShape(p.CLOSE)
    }

    const heads = p.color(pal.paper)
    heads.setAlpha(165)
    p.stroke(heads)
    p.strokeWeight(2.6)
    for (let i = 0; i < SIDES; i++) {
      const a0 = (i / SIDES) * p.TWO_PI + rot
      const a1 = ((i + 1) / SIDES) * p.TWO_PI + rot
      const u = (p.frameCount * 0.006 + phase + i * 0.055) % 1
      p.point(p.lerp(p.cos(a0), p.cos(a1), u) * radius, p.lerp(p.sin(a0), p.sin(a1), u) * radius)
    }
  }
}
