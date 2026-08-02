import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Blob {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  heat: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const blobs: Blob[] = []
  const left = ctx.width * 0.27
  const right = ctx.width * 0.73
  const top = ctx.height * 0.1
  const bottom = ctx.height * 0.9

  function reset(blob: Blob, scatter: boolean) {
    blob.x = p.random(left + 25, right - 25)
    blob.y = scatter ? p.random(top + 30, bottom - 30) : p.random(bottom - 45, bottom - 20)
    blob.r = p.random(12, 28)
    blob.vx = p.random(-0.25, 0.25)
    blob.vy = p.random(-0.3, 0.1)
    blob.heat = blob.y > (top + bottom) * 0.5 ? 1 : -1
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 18; i++) {
      const blob = { x: 0, y: 0, r: 0, vx: 0, vy: 0, heat: 1 }
      reset(blob, true)
      blobs.push(blob)
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const f = p.frameCount
    for (const blob of blobs) {
      if (blob.y - blob.r < top + 10) blob.heat = -1
      if (blob.y + blob.r > bottom - 10) blob.heat = 1
      blob.vy = (blob.vy - blob.heat * (0.012 + blob.r * 0.0011)) * 0.987
      blob.vx = (blob.vx + (p.noise(blob.x * 0.01, blob.y * 0.01, f * 0.003) - 0.5) * 0.035) * 0.98
      blob.x += blob.vx
      blob.y += blob.vy
      if (blob.x - blob.r < left || blob.x + blob.r > right) {
        blob.x = Math.min(right - blob.r, Math.max(left + blob.r, blob.x))
        blob.vx *= -0.8
      }
    }

    for (let i = 0; i < blobs.length; i++) {
      for (let j = i + 1; j < blobs.length; j++) {
        const a = blobs[i]
        const b = blobs[j]
        const distance = Math.hypot(a.x - b.x, a.y - b.y)
        if (distance > (a.r + b.r) * 0.55 || (f + i + j) % 5 !== 0) continue
        const large = a.r >= b.r ? a : b
        const small = a.r >= b.r ? b : a
        large.r = Math.min(48, Math.sqrt(large.r * large.r + small.r * small.r))
        large.heat = (large.heat + small.heat) * 0.5
        reset(small, false)
      }
    }

    p.noStroke()
    for (let i = 0; i < blobs.length; i++) {
      const a = blobs[i]
      for (let j = i + 1; j < blobs.length; j++) {
        const b = blobs[j]
        if (Math.hypot(a.x - b.x, a.y - b.y) > (a.r + b.r) * 1.08) continue
        const bridge = p.color(ctx.palette.signal)
        bridge.setAlpha(70)
        p.stroke(bridge)
        p.strokeWeight(Math.min(a.r, b.r) * 0.8)
        p.line(a.x, a.y, b.x, b.y)
      }
    }
    for (const blob of blobs) {
      const fill = p.color(blob.heat > 0 ? ctx.palette.accent : ctx.palette.signal)
      fill.setAlpha(blob.heat > 0 ? 115 : 150)
      p.fill(fill)
      p.noStroke()
      p.circle(blob.x, blob.y, blob.r * 2)
      p.noFill()
      p.stroke(ctx.palette.signal)
      p.strokeWeight(1.3)
      p.circle(blob.x, blob.y, blob.r * 2)
    }
    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(2)
    p.rect(left, top, right - left, bottom - top, ctx.width * 0.14)
    p.stroke(ctx.palette.accent)
    p.line(left + 25, bottom + 10, right - 25, bottom + 10)
  }
}
