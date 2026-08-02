import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Point {
  x: number
  y: number
}

const DEPTH = 5
const COUNT = 1 << (DEPTH * 2)
const LAYERS = 2

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const dust: Point[] = []
  let phase = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(1)
    for (let index = 0; index < COUNT; index++) {
      let code = index
      let x = 0
      let y = 0
      let place = 1 / 3
      for (let depth = 0; depth < DEPTH; depth++) {
        const corner = code & 3
        x += (corner & 1 ? 1 : -1) * place
        y += (corner & 2 ? 1 : -1) * place
        code >>= 2
        place /= 3
      }
      dust.push({ x, y })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const zt = (phase + p.frameCount * 0.0032) % 1
    const cyan = p.color(pal.signal)
    cyan.setAlpha(205)
    const dim = p.color(pal.dim)
    dim.setAlpha(150)
    const hot = p.color(pal.accent)
    hot.setAlpha(220)
    const span = Math.min(p.width, p.height) * 0.93

    for (let layer = LAYERS - 1; layer >= 0; layer--) {
      const zoom = Math.pow(3, zt - layer)
      const angle = (zt - layer) * 0.075
      const co = Math.cos(angle)
      const si = Math.sin(angle)
      p.strokeWeight(layer === 0 ? 2 : 1.4)
      for (let i = 0; i < dust.length; i++) {
        const q = dust[i]!
        const x = (q.x * co - q.y * si) * zoom
        const y = (q.x * si + q.y * co) * zoom
        const sx = p.width / 2 + x * span
        const sy = p.height / 2 + y * span
        if (sx < 0 || sx > p.width || sy < 0 || sy > p.height) continue
        p.stroke(layer === 0 && i % 211 === 0 ? hot : layer === 0 ? cyan : dim)
        p.point(sx, sy)
      }
    }
  }
}
