import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const slitCount = 5

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const gratingX = ctx.width * 0.31
    const screenX = ctx.width * 0.88
    const spacing = ctx.height * 0.105
    const slitY = (index: number): number => ctx.height * 0.5 + (index - (slitCount - 1) / 2) * spacing
    const travel = p.frameCount * ctx.width * 0.006

    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    for (let front = 0; front < 9; front++) {
      const x = gratingX - ((travel + front * ctx.width * 0.055) % (gratingX - ctx.width * 0.05))
      p.line(x, ctx.height * 0.1, x, ctx.height * 0.9)
    }

    p.noFill()
    for (let slit = 0; slit < slitCount; slit++) {
      for (let front = 0; front < 11; front++) {
        const radius = (travel + front * ctx.width * 0.06) % (ctx.width * 0.72)
        const color = p.color(front % 5 === 0 ? ctx.palette.accent : ctx.palette.signal)
        color.setAlpha(Math.max(28, 155 - radius * 0.16))
        p.stroke(color)
        p.strokeWeight(front % 5 === 0 ? 1.8 : 1)
        p.arc(gratingX, slitY(slit), radius * 2, radius * 2, -p.HALF_PI, p.HALF_PI)
      }
    }

    p.stroke(ctx.palette.paper)
    p.strokeWeight(4)
    let segmentTop = ctx.height * 0.08
    for (let slit = 0; slit < slitCount; slit++) {
      const y = slitY(slit)
      p.line(gratingX, segmentTop, gratingX, y - 9)
      segmentTop = y + 9
    }
    p.line(gratingX, segmentTop, gratingX, ctx.height * 0.92)

    p.stroke(ctx.palette.signal)
    for (let y = ctx.height * 0.1; y <= ctx.height * 0.9; y += 4) {
      let field = 0
      for (let slit = 0; slit < slitCount; slit++) {
        const distance = Math.hypot(screenX - gratingX, y - slitY(slit))
        field += Math.cos(distance * 0.075 - travel * 0.075)
      }
      p.strokeWeight(1 + Math.abs(field) * 1.2)
      p.point(screenX, y)
    }
    p.stroke(ctx.palette.accent)
    p.strokeWeight(2)
    p.line(screenX, ctx.height * 0.08, screenX, ctx.height * 0.92)
  }
}
