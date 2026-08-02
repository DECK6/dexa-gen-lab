import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Fiber {
  x0: number
  y0: number
  x1: number
  y1: number
  x2: number
  y2: number
  x3: number
  y3: number
  phase: number
  speed: number
}

const cubic = (a: number, b: number, c: number, d: number, t: number): number => {
  const u = 1 - t
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const fibers: Fiber[] = []
  const pointOn = (fiber: Fiber, progress: number): [number, number] => [
    cubic(fiber.x0, fiber.x1, fiber.x2, fiber.x3, progress),
    cubic(fiber.y0, fiber.y1, fiber.y2, fiber.y3, progress),
  ]

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 28; i++) {
      const startY = ctx.height * (0.72 + p.random(-0.035, 0.035))
      const endY = p.random(ctx.height * 0.14, ctx.height * 0.86)
      fibers.push({
        x0: ctx.width * 0.12,
        y0: startY,
        x1: ctx.width * p.random(0.32, 0.42),
        y1: startY + p.random(-ctx.height * 0.18, ctx.height * 0.12),
        x2: ctx.width * p.random(0.58, 0.72),
        y2: endY + p.random(-ctx.height * 0.12, ctx.height * 0.12),
        x3: ctx.width * p.random(0.84, 0.9),
        y3: endY,
        phase: p.random(1),
        speed: p.random(0.0038, 0.0085),
      })
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    p.noFill()
    for (let i = 0; i < fibers.length; i++) {
      const fiber = fibers[i]
      p.stroke(ctx.palette.dim)
      p.strokeWeight(1)
      p.bezier(fiber.x0, fiber.y0, fiber.x1, fiber.y1, fiber.x2, fiber.y2, fiber.x3, fiber.y3)
      const progress = (fiber.phase + p.frameCount * fiber.speed) % 1
      const pulse = p.color(i % 13 === 0 ? ctx.palette.accent : ctx.palette.signal)
      pulse.setAlpha(220)
      p.stroke(pulse)
      p.strokeWeight(2.4)
      p.beginShape()
      for (let step = 0; step <= 8; step++) {
        const u = Math.max(0, progress - 0.13 + step / 8 * 0.13)
        const [x, y] = pointOn(fiber, u)
        p.vertex(x, y)
      }
      p.endShape()
      const [px, py] = pointOn(fiber, progress)
      p.noStroke()
      p.fill(pulse)
      p.circle(px, py, 5)
      const endpointGlow = Math.max(0, (progress - 0.84) / 0.16)
      pulse.setAlpha(45 + endpointGlow * 190)
      p.noFill()
      p.stroke(pulse)
      p.circle(fiber.x3, fiber.y3, 5 + endpointGlow * 18)
    }
  }
}
