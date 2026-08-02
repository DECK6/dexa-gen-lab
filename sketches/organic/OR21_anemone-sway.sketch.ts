import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const TENTACLES = 28

type Joint = { x: number; y: number; px: number; py: number }
type Chain = { baseX: number; baseY: number; step: number; joints: Joint[]; hot: boolean }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const chains: Chain[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < TENTACLES; i++) {
      const u = i / (TENTACLES - 1)
      const baseX = p.width * (0.25 + u * 0.5)
      const baseY = p.height * (0.79 + Math.abs(u - 0.5) * 0.13)
      const count = Math.floor(p.random(16, 25))
      const step = p.random(7, 10)
      const slant = (u - 0.5) * 0.8 + p.random(-0.18, 0.18)
      const joints: Joint[] = []
      for (let j = 0; j < count; j++) {
        const x = baseX + slant * j * step * 0.35
        const y = baseY - j * step
        joints.push({ x, y, px: x, py: y })
      }
      chains.push({ baseX, baseY, step, joints, hot: p.random() < 0.12 })
    }
    p.strokeCap(p.ROUND)
  }

  const simulate = (chain: Chain, time: number) => {
    for (let i = 1; i < chain.joints.length; i++) {
      const q = chain.joints[i]!
      const vx = (q.x - q.px) * 0.965
      const vy = (q.y - q.py) * 0.965
      q.px = q.x
      q.py = q.y
      const flow = (p.noise(q.x * 0.004, q.y * 0.005, time) - 0.42) * 0.23
      q.x += vx + flow * (0.3 + i / chain.joints.length)
      q.y += vy - 0.035
    }
    for (let pass = 0; pass < 4; pass++) {
      const root = chain.joints[0]!
      root.x = chain.baseX
      root.y = chain.baseY
      for (let i = 1; i < chain.joints.length; i++) {
        const a = chain.joints[i - 1]!
        const b = chain.joints[i]!
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 1
        const correction = (d - chain.step) / d
        if (i === 1) {
          b.x -= dx * correction
          b.y -= dy * correction
        } else {
          a.x += dx * correction * 0.5
          a.y += dy * correction * 0.5
          b.x -= dx * correction * 0.5
          b.y -= dy * correction * 0.5
        }
      }
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const time = p.frameCount * 0.006
    const body = p.color(pal.dim)
    body.setAlpha(100)
    p.noStroke()
    p.fill(body)
    p.ellipse(p.width / 2, p.height * 0.86, p.width * 0.57, p.height * 0.18)
    const tentacle = p.color(pal.signal)
    const hot = p.color(pal.accent)
    for (const chain of chains) {
      simulate(chain, time)
      tentacle.setAlpha(150)
      p.noFill()
      p.stroke(tentacle)
      p.strokeWeight(1.8)
      p.beginShape()
      for (const q of chain.joints) p.vertex(q.x, q.y)
      p.endShape()
      const tip = chain.joints[chain.joints.length - 1]!
      const col = chain.hot ? hot : tentacle
      col.setAlpha(chain.hot ? 220 : 175)
      p.noStroke()
      p.fill(col)
      p.ellipse(tip.x, tip.y, chain.hot ? 4.5 : 2.8)
    }
  }
}
