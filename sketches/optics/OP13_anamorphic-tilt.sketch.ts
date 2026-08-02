import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Point = [number, number]

export function sketch(p: P5, ctx: SketchCtx): void {
  const project = (x: number, y: number, angle: number): Point => {
    const focal = ctx.width * 0.72
    const depth = -x * Math.sin(angle)
    const scale = focal / (focal + depth)
    return [ctx.width / 2 + x * Math.cos(angle) * scale, ctx.height / 2 + y * scale]
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    const angle = Math.sin(t * 0.62) * 1.02
    const extent = ctx.width * 0.31

    p.noFill()
    p.stroke(ctx.palette.dim)
    for (let grid = -4; grid <= 4; grid++) {
      p.beginShape()
      for (let step = -18; step <= 18; step++) {
        const [x, y] = project(grid * extent / 4, step * extent / 18, angle)
        p.vertex(x, y)
      }
      p.endShape()
    }

    const signal = p.color(ctx.palette.signal)
    signal.setAlpha(220)
    p.stroke(signal)
    p.strokeWeight(2)
    for (let ring = 1; ring <= 3; ring++) {
      p.beginShape()
      for (let step = 0; step <= 72; step++) {
        const phase = step / 72 * p.TWO_PI
        const radius = extent * ring / 3
        const [x, y] = project(Math.cos(phase) * radius, Math.sin(phase) * radius, angle)
        p.vertex(x, y)
      }
      p.endShape()
    }

    const [cx, cy] = project(0, 0, angle)
    const accent = p.color(ctx.palette.accent)
    accent.setAlpha(235)
    p.stroke(accent)
    p.line(cx - 13, cy, cx + 13, cy)
    p.line(cx, cy - 13, cx, cy + 13)
  }
}
