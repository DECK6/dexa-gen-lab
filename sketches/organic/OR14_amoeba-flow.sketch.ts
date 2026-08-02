import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const VERTICES = 80

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let x = 0
  let y = 0
  let heading = 0
  let seed = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    x = p.width / 2
    y = p.height / 2
    heading = p.random(p.TWO_PI)
    seed = p.random(100)
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.009
    const desired = p.noise(seed, t * 0.28) * p.TWO_PI * 2
    heading += Math.atan2(Math.sin(desired - heading), Math.cos(desired - heading)) * 0.018
    x += Math.cos(heading) * 0.42
    y += Math.sin(heading) * 0.42
    const margin = p.width * 0.2
    if (x < margin || x > p.width - margin || y < margin || y > p.height - margin) {
      const home = Math.atan2(p.height / 2 - y, p.width / 2 - x)
      heading += Math.atan2(Math.sin(home - heading), Math.cos(home - heading)) * 0.08
    }

    const membrane = p.color(pal.signal)
    const cytoplasm = p.color(pal.signal)
    cytoplasm.setAlpha(24)
    membrane.setAlpha(205)
    p.fill(cytoplasm)
    p.stroke(membrane)
    p.strokeWeight(2)
    p.beginShape()
    for (let i = 0; i < VERTICES; i++) {
      const a = (i / VERTICES) * p.TWO_PI
      const delta = Math.atan2(Math.sin(a - heading), Math.cos(a - heading))
      const foot = Math.exp(-delta * delta * 4.2) * p.width * (0.07 + 0.018 * Math.sin(t * 2.1))
      const ripple = (p.noise(seed + Math.cos(a) * 0.7, seed + Math.sin(a) * 0.7, t) - 0.5) * p.width * 0.045
      const r = p.width * 0.105 + ripple + foot
      p.vertex(x + Math.cos(a) * r, y + Math.sin(a) * r)
    }
    for (let i = 0; i < 3; i++) {
      const a = (i / VERTICES) * p.TWO_PI
      const delta = Math.atan2(Math.sin(a - heading), Math.cos(a - heading))
      const foot = Math.exp(-delta * delta * 4.2) * p.width * (0.07 + 0.018 * Math.sin(t * 2.1))
      const ripple = (p.noise(seed + Math.cos(a) * 0.7, seed + Math.sin(a) * 0.7, t) - 0.5) * p.width * 0.045
      const r = p.width * 0.105 + ripple + foot
      p.vertex(x + Math.cos(a) * r, y + Math.sin(a) * r)
    }
    p.endShape()

    const nucleus = p.color(pal.accent)
    nucleus.setAlpha(170)
    p.noStroke()
    p.fill(nucleus)
    p.ellipse(x - Math.cos(heading) * 18, y - Math.sin(heading) * 18, 11 + Math.sin(t * 3) * 2)
  }
}
