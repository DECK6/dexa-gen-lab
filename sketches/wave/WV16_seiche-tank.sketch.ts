import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const left = ctx.width * 0.1
    const right = ctx.width * 0.9
    const top = ctx.height * 0.2
    const bottom = ctx.height * 0.78
    const level = ctx.height * 0.48
    const mode = 1 + Math.floor(p.frameCount / 360) % 2
    const phase = p.frameCount * 0.025 / Math.sqrt(mode)
    const amplitude = ctx.height * 0.095
    const surface = (x: number): number => level - amplitude * Math.cos(mode * Math.PI * (x - left) / (right - left)) * Math.sin(phase)

    const water = p.color(ctx.palette.signal)
    water.setAlpha(30)
    p.fill(water)
    p.noStroke()
    p.beginShape()
    p.vertex(left, bottom)
    p.vertex(left, surface(left))
    for (let x = left; x <= right; x += 5) p.vertex(x, surface(x))
    p.vertex(right, bottom)
    p.endShape(p.CLOSE)

    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2.5)
    p.beginShape()
    for (let x = left; x <= right; x += 4) p.vertex(x, surface(x))
    p.endShape()

    const velocity = Math.cos(phase)
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    for (let row = 0; row < 4; row++) {
      for (let column = 1; column < 9; column++) {
        const x = p.lerp(left, right, column / 9)
        const y = p.lerp(level + 55, bottom - 28, row / 3)
        const flow = Math.sin(mode * Math.PI * column / 9) * velocity * 16
        p.line(x - flow, y, x + flow, y)
        p.point(x + flow, y - 2)
        p.point(x + flow, y + 2)
      }
    }

    p.stroke(ctx.palette.paper)
    p.strokeWeight(4)
    p.line(left, top, left, bottom)
    p.line(left, bottom, right, bottom)
    p.line(right, bottom, right, top)
    p.fill(ctx.palette.accent)
    p.noStroke()
    p.circle(left + 9, surface(left), 8)
    p.circle(right - 9, surface(right), 8)
  }
}
