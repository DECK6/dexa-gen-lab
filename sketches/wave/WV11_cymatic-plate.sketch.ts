import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Grain {
  x: number
  y: number
  vx: number
  vy: number
}

const MODES = [[2, 3], [3, 5], [4, 7]] as const

function chladni(x: number, y: number, m: number, n: number): [number, number, number] {
  const piX = Math.PI * x
  const piY = Math.PI * y
  const value = Math.cos(m * piX) * Math.cos(n * piY) - Math.cos(n * piX) * Math.cos(m * piY)
  const gx = -m * Math.PI * Math.sin(m * piX) * Math.cos(n * piY)
    + n * Math.PI * Math.sin(n * piX) * Math.cos(m * piY)
  const gy = -n * Math.PI * Math.cos(m * piX) * Math.sin(n * piY)
    + m * Math.PI * Math.cos(n * piX) * Math.sin(m * piY)
  return [value, gx, gy]
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const grains: Grain[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 850; i++) {
      grains.push({ x: p.random(0.06, 0.94), y: p.random(0.06, 0.94), vx: 0, vy: 0 })
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const epoch = Math.floor(p.frameCount / 260)
    const local = (p.frameCount % 260) / 260
    const blend = Math.max(0, (local - 0.72) / 0.28)
    const eased = blend * blend * (3 - 2 * blend)
    const modeA = MODES[epoch % MODES.length]
    const modeB = MODES[(epoch + 1) % MODES.length]
    const size = Math.min(ctx.width, ctx.height) * 0.84
    const ox = (ctx.width - size) / 2
    const oy = (ctx.height - size) / 2

    p.noFill()
    p.stroke(ctx.palette.dim)
    p.rect(ox, oy, size, size)
    for (const grain of grains) {
      const a = chladni(grain.x, grain.y, modeA[0], modeA[1])
      const b = chladni(grain.x, grain.y, modeB[0], modeB[1])
      const value = p.lerp(a[0], b[0], eased)
      const gx = p.lerp(a[1], b[1], eased)
      const gy = p.lerp(a[2], b[2], eased)
      const drift = p.noise(grain.x * 7, grain.y * 7, p.frameCount * 0.008) - 0.5
      grain.vx = grain.vx * 0.82 - value * gx * 0.00016 + drift * 0.00012
      grain.vy = grain.vy * 0.82 - value * gy * 0.00016 - drift * 0.00012
      grain.x = Math.min(0.96, Math.max(0.04, grain.x + grain.vx))
      grain.y = Math.min(0.96, Math.max(0.04, grain.y + grain.vy))
      p.stroke(Math.abs(value) < 0.055 ? ctx.palette.accent : ctx.palette.signal)
      p.strokeWeight(Math.abs(value) < 0.055 ? 2.2 : 1.25)
      p.point(ox + grain.x * size, oy + grain.y * size)
    }
    p.stroke(ctx.palette.paper)
    p.strokeWeight(1)
    p.line(ox - 10, oy, ox + 18, oy)
    p.line(ox, oy - 10, ox, oy + 18)
  }
}
