import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const LAYERS = 24
const SAMPLES = 72
const CYCLE = 360

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let noiseSeed = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    noiseSeed = p.random(100)
  }

  const boundary = (layer: number, u: number, time: number) => {
    const mound = Math.sin(u * p.PI) * p.height * 0.13
    const rough = (p.noise(noiseSeed + u * 3.8, layer * 0.19, time) - 0.5) * p.height * 0.055
    return p.height * 0.86 - layer * p.height * 0.024 - mound - rough
  }

  p.draw = () => {
    p.background(pal.bg)
    const age = (p.frameCount - 1) % CYCLE
    const shown = Math.min(LAYERS, 4 + Math.floor(age / 5))
    const fade = age > 315 ? 1 - (age - 315) / 45 : 1
    const time = p.frameCount * 0.002
    const fill = p.color(pal.signal)
    const edge = p.color(pal.signal)

    for (let layer = 0; layer < shown; layer++) {
      const newest = layer === shown - 1
      fill.setAlpha((newest ? 26 : 9) * fade)
      edge.setAlpha((newest ? 220 : 75 + layer * 3) * fade)
      p.fill(fill)
      p.stroke(edge)
      p.strokeWeight(newest ? 1.8 : 1)
      p.beginShape()
      for (let i = 0; i <= SAMPLES; i++) {
        const u = i / SAMPLES
        p.vertex(p.width * (0.08 + u * 0.84), boundary(layer, u, time))
      }
      p.vertex(p.width * 0.92, p.height * 0.9)
      p.vertex(p.width * 0.08, p.height * 0.9)
      p.endShape(p.CLOSE)
    }

    const mark = p.color(pal.accent)
    mark.setAlpha(190 * fade)
    p.stroke(mark)
    p.strokeWeight(1)
    const scan = (p.frameCount * 0.006) % 1
    const x = p.width * (0.08 + scan * 0.84)
    p.line(x, p.height * 0.08, x, p.height * 0.13)
    p.line(x - 4, p.height * 0.105, x + 4, p.height * 0.105)
  }
}
