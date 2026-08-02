import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Debris {
  x: number
  y: number
  size: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const debris: Debris[] = []
  const cx = ctx.width * 0.47
  const cy = ctx.height * 0.5
  const basin = ctx.width * 0.39

  function reset(item: Debris, scatter: boolean, radius: number) {
    const angle = p.random(p.TWO_PI)
    const distance = scatter ? p.random(radius * 0.18, radius) : p.random(radius * 0.86, radius)
    item.x = cx + Math.cos(angle) * distance
    item.y = cy + Math.sin(angle) * distance
    item.size = p.random(1.2, 4.5)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 540; i++) {
      const item = { x: 0, y: 0, size: 0 }
      reset(item, true, basin)
      debris.push(item)
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const phase = (p.frameCount % 360) / 360
    const waterRadius = basin * (1 - phase * 0.28)
    const sink = 0.45 + phase * 1.2
    const trail = p.color(ctx.palette.signal)
    trail.setAlpha(145)
    p.stroke(trail)
    p.strokeWeight(1.15)
    for (const item of debris) {
      const oldX = item.x
      const oldY = item.y
      const dx = item.x - cx
      const dy = item.y - cy
      const distance = Math.max(9, Math.hypot(dx, dy))
      const tangent = 1.25 + basin / distance * 0.8
      item.x += -dx / distance * sink - dy / distance * tangent
      item.y += -dy / distance * sink + dx / distance * tangent
      const newDistance = Math.hypot(item.x - cx, item.y - cy)
      if (newDistance < 13 || newDistance > waterRadius + 8) reset(item, false, waterRadius)
      else p.line(oldX, oldY, item.x, item.y)
    }

    p.noFill()
    const rim = p.color(ctx.palette.dim)
    rim.setAlpha(165)
    p.stroke(rim)
    p.strokeWeight(2)
    p.circle(cx, cy, waterRadius * 2)
    for (let i = 1; i < 5; i++) {
      const ring = p.color(i === 1 ? ctx.palette.accent : ctx.palette.signal)
      ring.setAlpha(115 - i * 15)
      p.stroke(ring)
      p.circle(cx, cy, 15 + i * i * 9 + Math.sin(p.frameCount * 0.06 + i) * 3)
    }
    p.fill(ctx.palette.ink)
    p.stroke(ctx.palette.accent)
    p.circle(cx, cy, 18 + phase * 14)

    const gaugeX = ctx.width * 0.92
    const gaugeTop = ctx.height * 0.2
    const gaugeBottom = ctx.height * 0.8
    p.stroke(ctx.palette.dim)
    p.line(gaugeX, gaugeTop, gaugeX, gaugeBottom)
    p.stroke(ctx.palette.accent)
    const level = p.lerp(gaugeTop, gaugeBottom, phase)
    p.line(gaugeX - 12, level, gaugeX + 12, level)
  }
}
