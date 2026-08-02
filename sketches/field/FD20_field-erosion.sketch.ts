import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const G = 64
const COUNT = 720
const CYCLE = 600

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const base = new Float32Array(G * G)
  const cut = new Float32Array(G * G)
  const px: number[] = []
  const py: number[] = []
  const vx: number[] = []
  const vy: number[] = []

  const resetField = (cycle: number) => {
    cut.fill(0)
    for (let j = 0; j < G; j++) {
      for (let i = 0; i < G; i++) base[j * G + i] = p.noise(i * 0.065, j * 0.065, cycle * 1.7) * 0.46 + (1 - j / G) * 0.54
    }
  }
  const height = (i: number, j: number) => {
    const x = Math.min(Math.max(i, 0), G - 1)
    const y = Math.min(Math.max(j, 0), G - 1)
    const index = y * G + x
    return base[index]! - cut[index]!
  }
  const spawn = (i: number, spread: boolean) => {
    px[i] = p.random(p.width)
    py[i] = spread ? p.random(p.height) : p.random(-8, 8)
    vx[i] = p.random(-0.2, 0.2)
    vy[i] = p.random(0.4, 1.2)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    resetField(0)
    for (let i = 0; i < COUNT; i++) spawn(i, true)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(14)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    if (p.frameCount % CYCLE === 0) {
      resetField(Math.floor(p.frameCount / CYCLE))
      for (let i = 0; i < COUNT; i++) spawn(i, false)
    }

    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    const cellW = p.width / G
    const cellH = p.height / G
    for (let i = 0; i < COUNT; i++) {
      const x = px[i]!
      const y = py[i]!
      const gx = Math.floor(x / cellW)
      const gy = Math.floor(y / cellH)
      const dhx = height(gx + 1, gy) - height(gx - 1, gy)
      const dhy = height(gx, gy + 1) - height(gx, gy - 1)
      const dm = Math.sqrt(dhx * dhx + dhy * dhy) + 1e-5
      vx[i] = vx[i]! * 0.76 - dhx / dm * 0.48
      vy[i] = vy[i]! * 0.76 - dhy / dm * 0.48 + 0.08
      px[i] = x + vx[i]!
      py[i] = y + vy[i]!
      const cx = Math.min(Math.max(gx, 0), G - 1)
      const cy = Math.min(Math.max(gy, 0), G - 1)
      const index = cy * G + cx
      cut[index] = Math.min(0.42, cut[index]! + 0.0024)
      const wear = cut[index]! / 0.42
      const col = i % 109 === 0 ? orange : cyan
      col.setAlpha(35 + wear * (i % 109 === 0 ? 190 : 125))
      p.stroke(col)
      p.strokeWeight(0.7 + wear * 1.2)
      p.line(x, y, px[i]!, py[i]!)
      if (px[i]! < 0 || px[i]! > p.width || py[i]! < 0 || py[i]! > p.height) spawn(i, false)
    }
  }
}
