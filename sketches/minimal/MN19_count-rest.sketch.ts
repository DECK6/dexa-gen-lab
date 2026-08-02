import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const size = Math.min(ctx.width, ctx.height)
    const beatFrame = p.frameCount % 120
    const beat = Math.floor(beatFrame / 24)
    const local = (beatFrame % 24) / 24
    const left = ctx.width / 2 - size * 0.18
    const spacing = size * 0.12
    const centerY = ctx.height / 2

    p.stroke(ctx.palette.dim)
    p.strokeWeight(size * 0.004)
    for (let i = 0; i < 4; i++) {
      const x = left + i * spacing
      p.line(x, centerY + size * 0.075, x, centerY + size * 0.092)
    }

    if (beat < 4) {
      const envelope = Math.sin(local * Math.PI)
      p.noStroke()
      p.fill(ctx.palette.signal)
      p.circle(left + beat * spacing, centerY, size * (0.025 + envelope * 0.055))
    }

    const cueX = p.lerp(left, left + spacing * 3, beatFrame / 120)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(cueX, centerY + size * 0.13, size * 0.011)
  }
}
