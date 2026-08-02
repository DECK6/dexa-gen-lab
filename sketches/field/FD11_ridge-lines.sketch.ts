import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 760
const SCALE = 0.005
const EPS = 2.2

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const px: number[] = []
  const py: number[] = []
  const vx: number[] = []
  const vy: number[] = []
  const age: number[] = []

  const ridge = (x: number, y: number, z: number) => Math.abs(p.noise(x * SCALE, y * SCALE, z) * 2 - 1)
  const spawn = (i: number) => {
    px[i] = p.random(p.width)
    py[i] = p.random(p.height)
    vx[i] = 0
    vy[i] = 0
    age[i] = Math.floor(p.random(420))
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) spawn(i)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(12)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    const z = p.frameCount * 0.00045
    for (let i = 0; i < COUNT; i++) {
      const x = px[i]!
      const y = py[i]!
      const gx = ridge(x + EPS, y, z) - ridge(x - EPS, y, z)
      const gy = ridge(x, y + EPS, z) - ridge(x, y - EPS, z)
      const gm = Math.sqrt(gx * gx + gy * gy) + 1e-6
      const meander = (p.noise(x * 0.009 + 30, y * 0.009, z * 3) - 0.5) * 0.75
      const dx = -gx / gm + (gy / gm) * meander
      const dy = -gy / gm - (gx / gm) * meander
      vx[i] = vx[i]! * 0.72 + dx * 0.55
      vy[i] = vy[i]! * 0.72 + dy * 0.55
      const nx = x + vx[i]!
      const ny = y + vy[i]!
      const depth = 1 - ridge(x, y, z)
      const col = i % 83 === 0 ? orange : cyan
      col.setAlpha(25 + depth * (i % 83 === 0 ? 180 : 105))
      p.stroke(col)
      p.strokeWeight(0.55 + depth * 1.15)
      p.line(x, y, nx, ny)
      px[i] = nx
      py[i] = ny
      age[i]!++
      if (nx < 0 || nx > p.width || ny < 0 || ny > p.height || age[i]! > 520) spawn(i)
    }
  }
}
