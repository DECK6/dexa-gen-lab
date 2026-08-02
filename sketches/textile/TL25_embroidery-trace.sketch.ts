import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const STITCHES = 240

export function sketch(p: P5, ctx: SketchCtx): void {
  const pointAt = (index: number) => {
    const angle = (index / STITCHES) * p.TWO_PI
    const radius = p.width * (0.25 + 0.075 * Math.cos(angle * 5))
    return { x: p.width / 2 + Math.cos(angle) * radius, y: p.height / 2 + Math.sin(angle) * radius }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    p.noFill()
    const cycle = (p.frameCount % 300) / 300
    const visible = 70 + Math.floor(cycle * (STITCHES - 70))
    const hoop = p.color(ctx.palette.paper)
    hoop.setAlpha(75)
    p.stroke(hoop)
    p.strokeWeight(4)
    p.circle(p.width / 2, p.height / 2, p.width * 0.78)

    const guide = p.color(ctx.palette.dim)
    guide.setAlpha(85)
    p.stroke(guide)
    p.strokeWeight(1)
    p.beginShape()
    for (let index = 0; index <= STITCHES; index++) {
      const point = pointAt(index)
      p.vertex(point.x, point.y)
    }
    p.endShape()

    for (let index = 0; index < visible; index++) {
      const from = pointAt(index)
      const to = pointAt(index + 1)
      const dx = to.x - from.x
      const dy = to.y - from.y
      const length = Math.max(1, Math.sqrt(dx * dx + dy * dy))
      const side = index % 2 === 0 ? 1 : -1
      const nx = (-dy / length) * 3.5 * side
      const ny = (dx / length) * 3.5 * side
      const thread = p.color(index % 19 === 0 ? ctx.palette.accent : ctx.palette.signal)
      thread.setAlpha(index % 19 === 0 ? 235 : 205)
      p.stroke(thread)
      p.strokeWeight(index % 19 === 0 ? 2.6 : 1.8)
      p.line(from.x + nx, from.y + ny, to.x - nx, to.y - ny)
    }

    const needle = pointAt(visible)
    const tail = p.color(ctx.palette.accent)
    tail.setAlpha(190)
    p.stroke(tail)
    p.strokeWeight(2)
    p.beginShape()
    for (let index = Math.max(0, visible - 16); index <= visible; index += 2) {
      const point = pointAt(index)
      p.vertex(point.x, point.y)
    }
    p.vertex(needle.x + 34, needle.y - 28)
    p.endShape()
    p.stroke(ctx.palette.paper)
    p.strokeWeight(3)
    p.line(needle.x - 12, needle.y + 10, needle.x + 18, needle.y - 14)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(needle.x, needle.y, 7)
  }
}
