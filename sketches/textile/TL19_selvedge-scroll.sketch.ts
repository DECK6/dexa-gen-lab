import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const top = p.height * 0.28
    const bottom = p.height * 0.72
    const rollX = p.width * 0.76
    const rollY = p.height * 0.5
    const radius = p.height * 0.2
    const feed = (p.frameCount * 0.55) % 18
    const cloth = p.color(ctx.palette.dim)
    cloth.setAlpha(35)
    p.noStroke()
    p.fill(cloth)
    p.rect(p.width * 0.06, top, rollX - p.width * 0.06, bottom - top)

    const weft = p.color(ctx.palette.signal)
    weft.setAlpha(80)
    p.stroke(weft)
    p.strokeWeight(1)
    for (let y = top + feed; y < bottom; y += 18) p.line(p.width * 0.06, y, rollX, y)
    for (let x = p.width * 0.07 + feed; x < rollX; x += 22) p.line(x, top, x, bottom)

    p.stroke(ctx.palette.signal)
    p.strokeWeight(4)
    p.line(p.width * 0.06, top, rollX, top)
    p.line(p.width * 0.06, bottom, rollX, bottom)
    p.noFill()
    p.stroke(ctx.palette.paper)
    p.strokeWeight(1.3)
    for (let x = p.width * 0.07 + feed; x < rollX; x += 18) {
      p.arc(x, top, 10, 10, p.PI, p.TWO_PI)
      p.arc(x, bottom, 10, 10, 0, p.PI)
    }

    const roll = p.color(ctx.palette.signal)
    roll.setAlpha(185)
    p.stroke(roll)
    p.strokeWeight(2)
    p.noFill()
    p.beginShape()
    const turns = p.TWO_PI * 9
    const rotation = -p.frameCount * 0.018
    for (let i = 0; i <= 220; i++) {
      const angle = (i / 220) * turns
      const r = 7 + (angle / turns) * (radius - 7)
      p.vertex(rollX + Math.cos(angle + rotation) * r, rollY + Math.sin(angle + rotation) * r)
    }
    p.endShape()
    p.stroke(ctx.palette.accent)
    p.strokeWeight(3)
    const mark = rotation + turns
    p.line(rollX + Math.cos(mark) * (radius - 8), rollY + Math.sin(mark) * (radius - 8), rollX + Math.cos(mark) * (radius + 5), rollY + Math.sin(mark) * (radius + 5))
  }
}
