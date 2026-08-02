import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Tracer {
  x: number
  y: number
  side: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const tracers: Tracer[] = []
  const mid = ctx.height * 0.5
  const band = ctx.height * 0.17

  function reset(tracer: Tracer, x: number) {
    tracer.x = x
    tracer.side = p.random() < 0.5 ? -1 : 1
    tracer.y = mid + tracer.side * p.random(4, band)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 620; i++) {
      const tracer = { x: 0, y: 0, side: 1 }
      reset(tracer, p.random(ctx.width))
      tracers.push(tracer)
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const f = p.frameCount
    const growth = 0.35 + 0.65 * Math.sin(Math.min(1, (f % 360) / 120) * p.HALF_PI)
    const signal = p.color(ctx.palette.signal)
    signal.setAlpha(125)
    p.stroke(signal)
    p.strokeWeight(1.15)
    for (const tracer of tracers) {
      const oldX = tracer.x
      const oldY = tracer.y
      let vx = 1.5 * Math.tanh((tracer.y - mid) / (band * 0.32))
      let vy = Math.sin(tracer.x * 0.026 + f * 0.035) * 0.045
      for (let j = 0; j < 6; j++) {
        const cx = (j + 0.5) * ctx.width / 6 + Math.sin(f * 0.012 + j) * 10
        const cy = mid + Math.sin(f * 0.018 + j * 1.7) * band * 0.22
        const dx = tracer.x - cx
        const dy = tracer.y - cy
        const r2 = Math.max(220, dx * dx + dy * dy)
        const spin = (j % 2 === 0 ? 1 : -1) * 190 * growth
        vx += -dy * spin / r2
        vy += dx * spin / r2
      }
      tracer.x += vx
      tracer.y += vy
      if (tracer.x < 0 || tracer.x > ctx.width || Math.abs(tracer.y - mid) > band * 1.55) {
        reset(tracer, tracer.x < 0 ? ctx.width : 0)
      } else if (Math.abs(tracer.x - oldX) < ctx.width * 0.5) {
        p.line(oldX, oldY, tracer.x, tracer.y)
      }
    }

    p.noFill()
    for (let j = 0; j < 6; j++) {
      const color = p.color(j % 2 === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(150)
      p.stroke(color)
      p.strokeWeight(1.4)
      const cx = (j + 0.5) * ctx.width / 6 + Math.sin(f * 0.012 + j) * 10
      const cy = mid + Math.sin(f * 0.018 + j * 1.7) * band * 0.22
      p.arc(cx, cy, band * 0.42, band * 0.42, j % 2 ? 0 : p.PI, j % 2 ? p.PI * 1.7 : p.PI * 2.7)
    }
    p.stroke(ctx.palette.dim)
    p.line(0, mid - band, ctx.width, mid - band)
    p.line(0, mid + band, ctx.width, mid + band)
  }
}
