import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const HOLES = 7

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    const sourceX = ctx.width * 0.17
    const holeX = ctx.width * 0.48
    const screenX = ctx.width * 0.82
    const sourceCenter = ctx.height * (0.5 + 0.08 * Math.sin(t * 1.05))
    const objectTop = sourceCenter - ctx.height * 0.09
    const objectBottom = sourceCenter + ctx.height * 0.09

    p.stroke(ctx.palette.dim)
    p.strokeWeight(3)
    p.line(holeX, ctx.height * 0.12, holeX, ctx.height * 0.88)
    p.strokeWeight(2)
    p.line(screenX, ctx.height * 0.1, screenX, ctx.height * 0.9)

    for (let i = 0; i < HOLES; i++) {
      const holeY = ctx.height * 0.5 + (i - (HOLES - 1) / 2) * ctx.height * 0.045
      const ratio = (screenX - holeX) / (sourceX - holeX)
      const imageTop = holeY + (objectTop - holeY) * ratio
      const imageBottom = holeY + (objectBottom - holeY) * ratio
      const ray = p.color(ctx.palette.signal)
      ray.setAlpha(38)
      p.stroke(ray)
      p.strokeWeight(1)
      p.line(sourceX, objectTop, holeX, holeY)
      p.line(holeX, holeY, screenX, imageTop)
      p.line(sourceX, objectBottom, holeX, holeY)
      p.line(holeX, holeY, screenX, imageBottom)

      const image = p.color(i === Math.floor(HOLES / 2) ? ctx.palette.accent : ctx.palette.signal)
      image.setAlpha(i === Math.floor(HOLES / 2) ? 220 : 105)
      p.stroke(image)
      p.strokeWeight(2)
      const imageX = screenX + (i - 3) * 2.5
      p.line(imageX, imageTop, imageX, imageBottom)
      p.line(imageX, imageBottom, imageX - 6, imageBottom - 9)
      p.line(imageX, imageBottom, imageX + 6, imageBottom - 9)
      p.noStroke()
      p.fill(image)
      p.circle(holeX, holeY, i === 3 ? 7 : 4)
    }

    p.stroke(ctx.palette.paper)
    p.strokeWeight(3)
    p.line(sourceX, objectBottom, sourceX, objectTop)
    p.line(sourceX, objectTop, sourceX - 8, objectTop + 13)
    p.line(sourceX, objectTop, sourceX + 8, objectTop + 13)
  }
}
