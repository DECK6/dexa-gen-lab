import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SIDE = 26
const K = 0.02 // spring back to lattice home
const DAMP = 0.88
const PUSH = 26

interface Node {
  hx: number
  hy: number
  x: number
  y: number
  vx: number
  vy: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const nodes: Node[] = []
  let reach = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    reach = p.width * 0.19
    const pad = p.width * 0.08
    const step = (p.width - pad * 2) / (SIDE - 1)
    for (let r = 0; r < SIDE; r++) {
      for (let c = 0; c < SIDE; c++) {
        const hx = pad + c * step
        const hy = pad + r * step
        nodes.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 })
      }
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(40)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const f = p.frameCount
    const rx = p.width * (0.5 + 0.36 * Math.sin(f * 0.011))
    const ry = p.height * (0.5 + 0.36 * Math.sin(f * 0.0073 + 1.2))

    const tether = p.color(pal.dim)
    tether.setAlpha(110)
    const dot = p.color(pal.signal)

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      let dx = n.x - rx
      let dy = n.y - ry
      const d = Math.hypot(dx, dy)
      if (d < reach && d > 0.001) {
        const w = (1 - d / reach) * PUSH
        dx /= d
        dy /= d
        n.vx += dx * w * 0.06
        n.vy += dy * w * 0.06
      }
      n.vx = (n.vx + (n.hx - n.x) * K) * DAMP
      n.vy = (n.vy + (n.hy - n.y) * K) * DAMP
      n.x += n.vx
      n.y += n.vy

      const off = Math.hypot(n.x - n.hx, n.y - n.hy)
      if (off > 1.5) {
        p.stroke(tether)
        p.strokeWeight(1)
        p.line(n.hx, n.hy, n.x, n.y)
      }
      dot.setAlpha(70 + Math.min(off * 6, 170))
      p.noStroke()
      p.fill(dot)
      p.ellipse(n.x, n.y, 2 + Math.min(off * 0.08, 2.4))
    }

    const mark = p.color(pal.accent)
    p.noFill()
    mark.setAlpha(150)
    p.stroke(mark)
    p.strokeWeight(1.4)
    p.ellipse(rx, ry, reach * 0.34)
    mark.setAlpha(60)
    p.stroke(mark)
    p.strokeWeight(1)
    p.ellipse(rx, ry, reach * 2)
  }
}
