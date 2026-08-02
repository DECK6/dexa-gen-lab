import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Segment {
  ax: number
  ay: number
  bx: number
  by: number
  depth: number
  main: boolean
}

const MAX_DEPTH = 11
const CYCLE = 72

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const bolts: Segment[] = []

  const leader = (x: number, y: number, angle: number, len: number, depth: number, main: boolean) => {
    if (depth >= MAX_DEPTH || bolts.length >= 1200 || y > p.height * 1.08) return
    const a = angle + p.random(-0.3, 0.3) * (1 - depth / (MAX_DEPTH + 2))
    const step = len * p.random(0.76, 1.12)
    const nx = x + Math.cos(a) * step
    const ny = y + Math.sin(a) * step
    bolts.push({ ax: x, ay: y, bx: nx, by: ny, depth, main })
    leader(nx, ny, a, len * 0.93, depth + 1, main)
    const forkChance = main ? 0.68 : 0.28
    if (depth > 1 && p.random() < forkChance) {
      const side = p.random() < 0.5 ? -1 : 1
      leader(nx, ny, a + side * p.random(0.48, 0.92), len * 0.68, depth + 2, false)
    }
  }

  const strike = () => {
    bolts.length = 0
    leader(p.width / 2 + p.random(-p.width * 0.1, p.width * 0.1), -8, p.HALF_PI, p.height * 0.095, 0, true)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    strike()
  }

  p.draw = () => {
    if (p.frameCount % CYCLE === 0) strike()
    const veil = p.color(pal.bg)
    veil.setAlpha(34)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    const age = p.frameCount % CYCLE
    const power = Math.exp(-age / 35)
    const glow = p.color(pal.dim)
    glow.setAlpha(55 * power + 8)
    const cyan = p.color(pal.signal)
    cyan.setAlpha(215 * power + 24)
    const hot = p.color(pal.accent)
    hot.setAlpha(230 * power + 20)

    for (const s of bolts) {
      p.stroke(glow)
      p.strokeWeight(s.main ? 5.5 : 3)
      p.line(s.ax, s.ay, s.bx, s.by)
    }
    for (const s of bolts) {
      p.stroke(cyan)
      p.strokeWeight(Math.max(0.65, (s.main ? 2.1 : 1.15) - s.depth * 0.07))
      p.line(s.ax, s.ay, s.bx, s.by)
      if (s.main && s.depth === MAX_DEPTH - 1) {
        p.stroke(hot)
        p.strokeWeight(3)
        p.point(s.bx, s.by)
      }
    }
  }
}
