import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Point = { x: number; y: number }

function circleJoin(a: Point, b: Point, ra: number, rb: number): Point {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const along = (ra * ra - rb * rb + distance * distance) / (2 * distance)
  const height = Math.sqrt(Math.max(0, ra * ra - along * along))
  return {
    x: a.x + (dx * along - dy * height) / distance,
    y: a.y + (dy * along + dx * height) / distance,
  }
}

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const center = { x: ctx.width * 0.5, y: ctx.height * 0.5 }
    const left = { x: center.x - size * 0.14, y: center.y }
    const right = { x: center.x + size * 0.14, y: center.y }
    const rocker = size * 0.24
    const coupler = size * 0.23
    const solve = (angle: number): [Point, Point, Point] => {
      const moving = { x: left.x + Math.cos(angle) * rocker, y: left.y + Math.sin(angle) * rocker }
      const joined = circleJoin(moving, right, coupler, rocker)
      return [moving, joined, { x: (moving.x + joined.x) * 0.5, y: (moving.y + joined.y) * 0.5 }]
    }
    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    p.beginShape()
    for (let i = 0; i <= 90; i++) {
      const angle = p.HALF_PI + Math.sin((i / 90) * p.TWO_PI) * 0.45
      const midpoint = solve(angle)[2]
      p.vertex(midpoint.x, midpoint.y)
    }
    p.endShape()
    const angle = p.HALF_PI + Math.sin(p.frameCount * 0.025) * 0.45
    const [moving, joined, midpoint] = solve(angle)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(4)
    p.line(left.x, left.y, moving.x, moving.y)
    p.line(moving.x, moving.y, joined.x, joined.y)
    p.line(joined.x, joined.y, right.x, right.y)
    p.stroke(ctx.palette.paper)
    p.strokeWeight(1)
    p.line(midpoint.x - size * 0.12, midpoint.y, midpoint.x + size * 0.12, midpoint.y)
    p.noStroke()
    p.fill(ctx.palette.ink)
    for (const joint of [left, right, moving, joined]) {
      p.stroke(ctx.palette.signal)
      p.strokeWeight(2)
      p.circle(joint.x, joint.y, 14)
    }
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(midpoint.x, midpoint.y, 10)
  }
}
