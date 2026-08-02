import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const GRID = 36
const MARGIN = 90

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const hx: number[] = []
  const hy: number[] = []
  const px: number[] = []
  const py: number[] = []
  const vx = new Float32Array(GRID * GRID)
  const vy = new Float32Array(GRID * GRID)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let j = 0; j < GRID; j++) {
      for (let i = 0; i < GRID; i++) {
        const x = (i + 0.5) / GRID * p.width
        const y = (j + 0.5) / GRID * p.height
        hx.push(x)
        hy.push(y)
        px.push(x)
        py.push(y)
      }
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const nx = 0.87
    const ny = 0.493
    const tx = -ny
    const ty = nx
    const span = p.width * nx + p.height * ny
    const front = -MARGIN + (p.frameCount % 260) / 260 * (span + MARGIN * 2)
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    const dim = p.color(pal.dim)

    for (let i = 0; i < px.length; i++) {
      const distance = hx[i]! * nx + hy[i]! * ny - front
      const kick = Math.exp(-(distance * distance) / 520) * 0.82
      vx[i] = (vx[i]! + nx * kick + (hx[i]! - px[i]!) * 0.025) * 0.88
      vy[i] = (vy[i]! + ny * kick + (hy[i]! - py[i]!) * 0.025) * 0.88
      px[i]! += vx[i]!
      py[i]! += vy[i]!
      const energy = p.constrain(Math.sqrt(vx[i]! * vx[i]! + vy[i]! * vy[i]!) / 3, 0, 1)
      dim.setAlpha(58)
      p.stroke(dim)
      p.strokeWeight(0.7)
      p.line(hx[i]!, hy[i]!, px[i]!, py[i]!)
      cyan.setAlpha(75 + energy * 170)
      p.noStroke()
      p.fill(cyan)
      p.circle(px[i]!, py[i]!, 1.5 + energy * 3.2)
    }

    const fx = nx * front
    const fy = ny * front
    orange.setAlpha(190)
    p.stroke(orange)
    p.strokeWeight(1.6)
    p.line(fx - tx * p.width, fy - ty * p.width, fx + tx * p.width, fy + ty * p.width)
  }
}
