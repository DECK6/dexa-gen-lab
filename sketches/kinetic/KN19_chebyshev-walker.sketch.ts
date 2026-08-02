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
    const crank = size * 0.048
    const ground = size * 0.13
    const coupler = size * 0.14
    const rocker = size * 0.12
    const solve = (cx: number, cy: number, angle: number): [Point, Point, Point] => {
      const left = { x: cx - ground * 0.5, y: cy }
      const right = { x: cx + ground * 0.5, y: cy }
      const pin = { x: left.x + Math.cos(angle) * crank, y: left.y + Math.sin(angle) * crank }
      const knee = circleJoin(pin, right, coupler, rocker)
      return [pin, knee, { x: pin.x + (knee.x - pin.x) * 1.38, y: pin.y + (knee.y - pin.y) * 1.38 }]
    }
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    p.line(ctx.width * 0.08, ctx.height * 0.59, ctx.width * 0.92, ctx.height * 0.59)
    const time = p.frameCount * 0.032
    for (let i = 0; i < 4; i++) {
      const cx = ctx.width * (0.17 + i * 0.22)
      const cy = ctx.height * 0.39
      const left = { x: cx - ground * 0.5, y: cy }
      const right = { x: cx + ground * 0.5, y: cy }
      const [pin, knee, foot] = solve(cx, cy, time + i * p.HALF_PI)
      p.stroke(ctx.palette.signal)
      p.strokeWeight(3)
      p.line(left.x, left.y, pin.x, pin.y)
      p.line(pin.x, pin.y, knee.x, knee.y)
      p.line(knee.x, knee.y, right.x, right.y)
      p.line(pin.x, pin.y, foot.x, foot.y)
      p.noStroke()
      p.fill(i === 0 ? ctx.palette.accent : ctx.palette.paper)
      for (const joint of [left, right, pin, knee]) p.circle(joint.x, joint.y, 8)
      p.stroke(ctx.palette.paper)
      p.strokeWeight(4)
      p.line(foot.x - 11, foot.y, foot.x + 12, foot.y)
    }
    p.noFill()
    p.stroke(ctx.palette.accent)
    p.strokeWeight(1)
    p.beginShape()
    for (let i = 0; i <= 80; i++) {
      const foot = solve(ctx.width * 0.17, ctx.height * 0.39, (i / 80) * p.TWO_PI)[2]
      p.vertex(foot.x, foot.y)
    }
    p.endShape()
  }
}
