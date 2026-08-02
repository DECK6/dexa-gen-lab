import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const GRID = 18
const EPS = 2.4

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const ax: number[] = []
  const ay: number[] = []
  const phase: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let j = 0; j < GRID; j++) {
      for (let i = 0; i < GRID; i++) {
        ax.push((i + 0.5) / GRID * p.width + p.random(-9, 9))
        ay.push((j + 0.5) / GRID * p.height + p.random(-9, 9))
        phase.push(p.random(p.TWO_PI))
      }
    }
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(pal.bg)
    const z = p.frameCount * 0.0018
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    const dim = p.color(pal.dim)
    for (let i = 0; i < ax.length; i++) {
      const x = ax[i]! + Math.sin(p.frameCount * 0.006 + phase[i]!) * 5
      const y = ay[i]! + Math.cos(p.frameCount * 0.005 + phase[i]!) * 5
      const gx = p.noise((x + EPS) * 0.004, y * 0.004, z) - p.noise((x - EPS) * 0.004, y * 0.004, z)
      const gy = p.noise(x * 0.004, (y + EPS) * 0.004, z) - p.noise(x * 0.004, (y - EPS) * 0.004, z)
      const gm = Math.sqrt(gx * gx + gy * gy) + 1e-6
      const tx = -gy / gm
      const ty = gx / gm
      const level = p.noise(x * 0.004, y * 0.004, z)
      const half = 14 + (1 - Math.abs(level - 0.5) * 2) * 34
      dim.setAlpha(85)
      p.stroke(dim)
      p.strokeWeight(2.8)
      p.line(x - tx * half, y - ty * half, x + tx * half, y + ty * half)
      const hot = i % 47 === 0
      const col = hot ? orange : cyan
      col.setAlpha(hot ? 210 : 125)
      p.stroke(col)
      p.strokeWeight(hot ? 1.5 : 0.8)
      p.line(x - tx * half, y - ty * half, x + tx * half, y + ty * half)
      if ((i + Math.floor(p.frameCount / 24)) % 29 === 0) {
        col.setAlpha(230)
        p.noStroke()
        p.fill(col)
        p.circle(x + tx * half, y + ty * half, 3.5)
      }
    }
  }
}
