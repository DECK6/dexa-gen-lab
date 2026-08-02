import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type Point = { x: number; y: number }

function beltTangents(a: Point, ra: number, b: Point, rb: number): [[Point, Point], [Point, Point]] {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const base = Math.atan2(dy, dx)
  const offset = Math.acos((ra - rb) / distance)
  const pair = (sign: number): [Point, Point] => {
    const angle = base + sign * offset
    const nx = Math.cos(angle)
    const ny = Math.sin(angle)
    return [{ x: a.x + nx * ra, y: a.y + ny * ra }, { x: b.x + nx * rb, y: b.y + ny * rb }]
  }
  return [pair(-1), pair(1)]
}

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const drive = { x: ctx.width * 0.29, y: ctx.height * 0.53 }
    const follower = { x: ctx.width * 0.72, y: ctx.height * 0.53 }
    const driveRadius = size * 0.15
    const followerRadius = size * 0.085
    const [upper, lower] = beltTangents(drive, driveRadius, follower, followerRadius)
    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(5)
    p.line(upper[0].x, upper[0].y, upper[1].x, upper[1].y)
    p.bezier(lower[0].x, lower[0].y, ctx.width * 0.42, lower[0].y + 22, ctx.width * 0.59, lower[1].y + 22, lower[1].x, lower[1].y)
    const angle = p.frameCount * 0.035
    const wheel = (center: Point, radius: number, spin: number): void => {
      p.stroke(ctx.palette.signal)
      p.strokeWeight(3)
      p.circle(center.x, center.y, radius * 2)
      p.stroke(ctx.palette.dim)
      p.circle(center.x, center.y, radius * 1.7)
      for (let i = 0; i < 8; i++) {
        const a = spin + (i * p.TWO_PI) / 8
        p.line(center.x, center.y, center.x + Math.cos(a) * radius * 0.82, center.y + Math.sin(a) * radius * 0.82)
      }
      p.fill(ctx.palette.ink)
      p.stroke(ctx.palette.paper)
      p.circle(center.x, center.y, 14)
      p.noFill()
    }
    wheel(drive, driveRadius, angle)
    wheel(follower, followerRadius, angle * (driveRadius / followerRadius))
    p.noStroke()
    p.fill(ctx.palette.accent)
    for (let i = 0; i < 8; i++) {
      const q = (i / 8 + p.frameCount * 0.004) % 1
      p.circle(p.lerp(upper[0].x, upper[1].x, q), p.lerp(upper[0].y, upper[1].y, q), 7)
    }
    p.fill(ctx.palette.paper)
    p.rect(ctx.width * 0.44, ctx.height * 0.76, ctx.width * 0.12, 4)
    p.fill(ctx.palette.accent)
    p.rect(ctx.width * 0.44, ctx.height * 0.76, ctx.width * (0.04 + 0.025 * Math.sin(angle)), 4)
  }
}
