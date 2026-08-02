import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Tracer {
  x: number
  y: number
  age: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const tracers: Tracer[] = []
  const ox = ctx.width * 0.22
  const oy = ctx.height * 0.5
  const radius = ctx.width * 0.055

  function reset(tracer: Tracer, scatter: boolean) {
    tracer.x = scatter ? p.random(ctx.width) : -p.random(35)
    tracer.y = p.random(ctx.height * 0.16, ctx.height * 0.84)
    tracer.age = p.random(180, 520)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 520; i++) {
      const tracer = { x: 0, y: 0, age: 0 }
      reset(tracer, true)
      tracers.push(tracer)
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const f = p.frameCount
    const spacing = ctx.width * 0.105
    const stroke = p.color(ctx.palette.signal)
    stroke.setAlpha(135)
    p.stroke(stroke)
    p.strokeWeight(1.2)
    for (const tracer of tracers) {
      const oldX = tracer.x
      const oldY = tracer.y
      let vx = 1.55
      let vy = 0
      const obstacleDx = tracer.x - ox
      const obstacleDy = tracer.y - oy
      const obstacleR2 = obstacleDx * obstacleDx + obstacleDy * obstacleDy
      if (obstacleR2 < radius * radius * 5) {
        vy += obstacleDy / Math.max(radius, Math.sqrt(obstacleR2)) * 1.8
        vx *= 0.72
      }
      for (let j = 0; j < 7; j++) {
        const sign = j % 2 === 0 ? 1 : -1
        const vxCenter = ox + radius * 1.8 + (j * spacing + f * 0.75) % (ctx.width - ox)
        const vyCenter = oy + sign * radius * 0.95
        const dx = tracer.x - vxCenter
        const dy = tracer.y - vyCenter
        const r2 = Math.max(180, dx * dx + dy * dy)
        vx += -sign * dy * 150 / r2
        vy += sign * dx * 150 / r2
      }
      tracer.x += vx
      tracer.y += vy
      tracer.age--
      if (tracer.age < 0 || tracer.x > ctx.width + 8 || tracer.y < 0 || tracer.y > ctx.height) {
        reset(tracer, false)
      } else {
        p.line(oldX, oldY, tracer.x, tracer.y)
      }
    }

    p.noFill()
    p.strokeWeight(1)
    for (let j = 0; j < 7; j++) {
      const sign = j % 2 === 0 ? 1 : -1
      const x = ox + radius * 1.8 + (j * spacing + f * 0.75) % (ctx.width - ox)
      const ring = p.color(sign > 0 ? ctx.palette.accent : ctx.palette.signal)
      ring.setAlpha(125)
      p.stroke(ring)
      p.circle(x, oy + sign * radius * 0.95, radius * 0.72)
    }
    p.fill(ctx.palette.bg)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.circle(ox, oy, radius * 2)
    p.stroke(ctx.palette.dim)
    p.line(0, oy, ox - radius, oy)
  }
}
