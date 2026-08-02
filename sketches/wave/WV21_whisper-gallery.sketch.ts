import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const cx = ctx.width * 0.5
    const cy = ctx.height * 0.5
    const radius = Math.min(ctx.width, ctx.height) * 0.4
    const bounceAngle = 0.62
    const pointAt = (index: number): [number, number] => {
      const angle = -p.HALF_PI + index * bounceAngle
      return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]
    }

    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    for (let segment = -2; segment < 34; segment++) {
      const a = pointAt(segment)
      const b = pointAt(segment + 1)
      p.line(a[0], a[1], b[0], b[1])
    }
    const caustic = radius * Math.cos(bounceAngle / 2)
    p.stroke(ctx.palette.accent)
    p.ellipse(cx, cy, caustic * 2)
    p.stroke(ctx.palette.paper)
    p.strokeWeight(3)
    p.ellipse(cx, cy, radius * 2)

    for (let pulse = 0; pulse < 3; pulse++) {
      const travel = p.frameCount * 0.075 + pulse * 8.7
      const segment = Math.floor(travel)
      const progress = travel - segment
      for (let trail = 9; trail >= 0; trail--) {
        const trailTravel = travel - trail * 0.09
        const trailSegment = Math.floor(trailTravel)
        const trailProgress = trailTravel - trailSegment
        const a = pointAt(trailSegment)
        const b = pointAt(trailSegment + 1)
        const color = p.color(pulse === 0 ? ctx.palette.accent : ctx.palette.signal)
        color.setAlpha(35 + (9 - trail) * 20)
        p.stroke(color)
        p.strokeWeight(1 + (9 - trail) * 0.22)
        p.point(p.lerp(a[0], b[0], trailProgress), p.lerp(a[1], b[1], trailProgress))
      }
      const a = pointAt(segment)
      const b = pointAt(segment + 1)
      p.fill(pulse === 0 ? ctx.palette.accent : ctx.palette.signal)
      p.noStroke()
      p.circle(p.lerp(a[0], b[0], progress), p.lerp(a[1], b[1], progress), pulse === 0 ? 9 : 7)
    }
  }
}
