import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface ResistPoint {
  x: number
  y: number
  radius: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const points: ResistPoint[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < 9; i++) {
      points.push({ x: p.random(24, 220), y: p.random(10, 170), radius: p.random(8, 24) })
    }
    p.noFill()
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    p.noFill()
    const cycle = (p.frameCount % 240) / 240
    const unfold = 0.25 + 0.75 * (0.5 - 0.5 * Math.cos(cycle * p.TWO_PI))
    const spread = 0.3 + unfold * 0.7
    const centerX = p.width / 2
    const centerY = p.height / 2
    const clothSize = p.width * (0.34 + unfold * 0.58)

    const cloth = p.color(ctx.palette.dim)
    cloth.setAlpha(45)
    p.stroke(cloth)
    p.strokeWeight(1)
    p.rect(centerX - clothSize / 2, centerY - clothSize / 2, clothSize, clothSize)
    p.line(centerX - clothSize / 2, centerY, centerX + clothSize / 2, centerY)
    p.line(centerX, centerY - clothSize / 2, centerX, centerY + clothSize / 2)
    p.line(centerX - clothSize / 2, centerY - clothSize / 2, centerX + clothSize / 2, centerY + clothSize / 2)
    p.line(centerX + clothSize / 2, centerY - clothSize / 2, centerX - clothSize / 2, centerY + clothSize / 2)

    for (let index = 0; index < points.length; index++) {
      const point = points[index]!
      for (let swap = 0; swap < 2; swap++) {
        for (let sx = -1; sx <= 1; sx += 2) {
          for (let sy = -1; sy <= 1; sy += 2) {
            const localX = (swap ? point.y : point.x) * spread
            const localY = (swap ? point.x : point.y) * spread
            const x = centerX + localX * sx
            const y = centerY + localY * sy
            const dye = p.color(index % 7 === 0 ? ctx.palette.accent : ctx.palette.signal)
            dye.setAlpha(index % 7 === 0 ? 220 : 145)
            p.stroke(dye)
            p.strokeWeight(2)
            const pulse = point.radius * (0.8 + 0.2 * Math.sin(p.frameCount * 0.04 + index))
            p.circle(x, y, pulse * 2)
            p.circle(x, y, pulse * 0.7)
          }
        }
      }
    }

    p.noStroke()
    p.fill(ctx.palette.paper)
    p.circle(centerX, centerY, 6)
  }
}
