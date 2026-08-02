import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const FIBERS = 30
const SEGMENTS = 9

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const edge = p.width * 0.62
    const cycle = (p.frameCount % 240) / 240
    const fray = 0.25 + 0.75 * (0.5 - 0.5 * Math.cos(cycle * p.TWO_PI))
    const driftTime = p.frameCount * 0.006
    const cloth = p.color(ctx.palette.dim)
    cloth.setAlpha(38)
    p.noStroke()
    p.fill(cloth)
    p.rect(0, 0, edge, p.height)

    const weft = p.color(ctx.palette.dim)
    weft.setAlpha(75)
    p.stroke(weft)
    p.strokeWeight(1)
    for (let x = 12; x < edge; x += 18) p.line(x, 0, x, p.height)

    for (let row = 0; row < FIBERS; row++) {
      const y = (row + 0.5) * (p.height / FIBERS)
      const boundary = edge + (p.noise(row * 0.21, driftTime) - 0.5) * 42 * fray
      const looseLength = p.width * fray * (0.16 + p.noise(row * 0.37) * 0.18)
      const fiber = p.color(row % 8 === 0 ? ctx.palette.paper : ctx.palette.signal)
      fiber.setAlpha(row % 8 === 0 ? 150 : 190)
      p.stroke(fiber)
      p.strokeWeight(row % 5 === 0 ? 2.2 : 1.3)
      p.noFill()
      p.beginShape()
      p.vertex(0, y)
      p.vertex(boundary, y)
      for (let segment = 1; segment <= SEGMENTS; segment++) {
        const amount = segment / SEGMENTS
        const x = boundary + looseLength * amount
        const scatter = (p.noise(row * 0.23, segment * 0.31, driftTime) - 0.5) * 110 * fray * amount
        const curl = Math.sin(segment * 0.9 + row + driftTime * 8) * 13 * fray * amount
        p.vertex(x, y + scatter + curl)
      }
      p.endShape()
      if (row % 7 === 0) {
        p.noStroke()
        p.fill(ctx.palette.accent)
        p.circle(boundary + looseLength, y + (p.noise(row * 0.23, SEGMENTS * 0.31, driftTime) - 0.5) * 110 * fray + Math.sin(SEGMENTS * 0.9 + row + driftTime * 8) * 13 * fray, 5)
      }
    }

    p.stroke(ctx.palette.accent)
    p.strokeWeight(2)
    p.line(edge, 0, edge, p.height)
  }
}
