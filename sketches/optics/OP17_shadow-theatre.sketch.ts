import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const PUPPETS = [-0.29, -0.14, 0.02, 0.17, 0.31]

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const t = p.frameCount / 60
    const ground = ctx.height * 0.7
    const lightX = ctx.width * 0.5 + Math.cos(t * 0.76) * ctx.width * 0.37
    const lightY = ctx.height * (0.17 + 0.045 * Math.sin(t * 1.1))

    p.stroke(ctx.palette.dim)
    p.line(ctx.width * 0.06, ground, ctx.width * 0.94, ground)
    for (let i = 0; i < PUPPETS.length; i++) {
      const footX = ctx.width * (0.5 + PUPPETS[i])
      const height = ctx.height * (0.16 + 0.035 * Math.sin(i * 1.7 + t * 1.2))
      const topY = ground - height
      const projection = (ground - lightY) / (topY - lightY)
      const shadowX = lightX + (footX - lightX) * projection
      const shadow = p.color(ctx.palette.dim)
      shadow.setAlpha(150)
      p.noStroke()
      p.fill(shadow)
      p.beginShape()
      p.vertex(footX - 7, ground)
      p.vertex(footX + 7, ground)
      p.vertex(shadowX + 19, ground + 18)
      p.vertex(shadowX - 19, ground + 18)
      p.endShape(p.CLOSE)

      const ray = p.color(ctx.palette.signal)
      ray.setAlpha(44)
      p.stroke(ray)
      p.line(lightX, lightY, shadowX, ground)
      p.stroke(ctx.palette.signal)
      p.strokeWeight(4)
      p.line(footX, ground, footX, topY + 12)
      p.noFill()
      p.strokeWeight(2)
      p.circle(footX, topY + 7, 13)
      p.line(footX, topY + height * 0.47, footX - 10, topY + height * 0.62)
      p.line(footX, topY + height * 0.47, footX + 10, topY + height * 0.58)
    }

    const lamp = p.color(ctx.palette.accent)
    lamp.setAlpha(220)
    p.noStroke()
    p.fill(lamp)
    p.circle(lightX, lightY, 12)
    p.noFill()
    p.stroke(lamp)
    p.circle(lightX, lightY, 30 + 5 * Math.sin(t * 2))
  }
}
