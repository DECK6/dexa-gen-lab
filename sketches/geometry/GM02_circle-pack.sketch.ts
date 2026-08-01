import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MAX_CIRCLES = 380
const SPAWN_TRIES = 28
const HOLD_FRAMES = 100

interface Disc {
  x: number
  y: number
  r: number
  grown: boolean
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let discs: Disc[] = []
  let stalled = 0
  let phase: 'grow' | 'hold' | 'fade' = 'grow'
  let phaseFrame = 0
  let alpha = 1

  const fits = (x: number, y: number, r: number): boolean => {
    if (x - r < 6 || y - r < 6 || x + r > p.width - 6 || y + r > p.height - 6) return false
    for (const d of discs) {
      if (p.dist(x, y, d.x, d.y) < r + d.r + 2.5) return false
    }
    return true
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
  }

  const spawn = () => {
    for (let k = 0; k < SPAWN_TRIES; k++) {
      const x = p.random(p.width)
      const y = p.random(p.height)
      if (fits(x, y, 3)) {
        discs.push({ x, y, r: 3, grown: false, hot: p.random() < 0.09 })
        return true
      }
    }
    return false
  }

  const grow = () => {
    for (const d of discs) {
      if (d.grown) continue
      const next = d.r + 0.8
      if (!fits(d.x, d.y, next) || next > 66) d.grown = true
      else d.r = next
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    phaseFrame++

    if (phase === 'grow') {
      grow()
      for (let i = 0; i < 3; i++) {
        if (!spawn()) stalled++
        else stalled = 0
      }
      if (discs.length >= MAX_CIRCLES || stalled > 40) {
        phase = 'hold'
        phaseFrame = 0
      }
    } else if (phase === 'hold') {
      grow()
      if (phaseFrame > HOLD_FRAMES) {
        phase = 'fade'
        phaseFrame = 0
      }
    } else {
      alpha = p.max(0, 1 - phaseFrame / 45)
      if (alpha <= 0) {
        discs = []
        stalled = 0
        alpha = 1
        phase = 'grow'
        phaseFrame = 0
        spawn()
      }
    }

    // radar sweep keeps the settled packing breathing
    const sweep = (p.frameCount * 2.2) % (p.width * 0.85)
    for (const d of discs) {
      const lit = p.max(0, 1 - p.abs(p.dist(d.x, d.y, p.width / 2, p.height / 2) - sweep) / 55)
      const ring = p.color(d.hot ? pal.accent : pal.signal)
      const shimmer = 10 * p.sin(p.frameCount * 0.05 + d.x * 0.02 + d.y * 0.013)
      ring.setAlpha(p.min(255, (d.grown ? 138 : 222) + lit * 95 + shimmer) * alpha)
      p.stroke(ring)
      p.strokeWeight(d.hot ? 1.6 : 1.1)
      p.circle(d.x, d.y, d.r * 2)

      if (d.r > 14) {
        const core = p.color(pal.dim)
        core.setAlpha(150 * alpha)
        p.stroke(core)
        p.strokeWeight(1)
        p.line(d.x - 3, d.y, d.x + 3, d.y)
        p.line(d.x, d.y - 3, d.x, d.y + 3)
      }
    }
  }
}
