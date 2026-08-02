import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.strokeCap(p.ROUND)
    p.strokeJoin(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const size = Math.min(ctx.width, ctx.height)
    const phase = (p.frameCount % 240) / 240
    const head = Math.min(1, phase / 0.42)
    const tail = Math.min(1, Math.max(0, (phase - 0.52) / 0.32))
    const samples = 64
    const start = Math.floor(tail * samples)
    const end = Math.ceil(head * samples)
    const left = ctx.width / 2 - size * 0.3
    const width = size * 0.6
    const centerY = ctx.height / 2

    if (end > start) {
      p.noFill()
      p.stroke(ctx.palette.signal)
      p.strokeWeight(size * 0.007)
      p.beginShape()
      for (let i = start; i <= end; i++) {
        const unit = i / samples
        const envelope = Math.sin(unit * Math.PI)
        const y = centerY + envelope * (Math.sin(unit * p.TWO_PI) * size * 0.055 + Math.sin(unit * 6 * Math.PI) * size * 0.018)
        p.vertex(left + unit * width, y)
      }
      p.endShape()
    }

    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(p.lerp(left, left + width, phase), centerY + size * 0.13, size * 0.011)
  }
}
