import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.rectMode(p.CENTER)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const size = Math.min(ctx.width, ctx.height)
    const local = (p.frameCount % 120) / 120
    const direction = Math.floor(p.frameCount / 120) % 2 === 0 ? 1 : -1
    const travel = Math.min(1, local / 0.72)
    const eased = travel * travel * (3 - 2 * travel)
    const left = ctx.width / 2 - size * 0.19
    const right = ctx.width / 2 + size * 0.19
    const startA = direction === 1 ? left : right
    const endA = direction === 1 ? right : left
    const xA = p.lerp(startA, endA, eased)
    const xB = p.lerp(endA, startA, eased)
    const arc = Math.sin(eased * Math.PI) * size * 0.085
    const settling = local > 0.72 ? Math.sin(((local - 0.72) / 0.28) * p.TWO_PI) * 0.025 : 0

    p.noFill()
    p.strokeWeight(size * 0.006)
    p.push()
    p.translate(xA, ctx.height / 2 - arc)
    p.rotate(settling + Math.sin(eased * Math.PI) * 0.11)
    p.stroke(ctx.palette.signal)
    p.square(0, 0, size * 0.105)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(size * 0.038, -size * 0.038, size * 0.012)
    p.pop()

    p.push()
    p.translate(xB, ctx.height / 2 + arc)
    p.rotate(-settling - Math.sin(eased * Math.PI) * 0.11)
    p.noFill()
    p.stroke(ctx.palette.paper)
    p.square(0, 0, size * 0.105)
    p.pop()
  }
}
