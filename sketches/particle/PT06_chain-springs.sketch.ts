import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const STRANDS = 9
const NODES = 24
const GRAV = 0.24
const RELAX = 4

interface Node {
  x: number
  y: number
  px: number
  py: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const chains: Node[][] = []
  let link = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    link = (p.height * 0.7) / (NODES - 1)
    for (let s = 0; s < STRANDS; s++) {
      const ax = p.width * (0.07 + (0.86 * s) / (STRANDS - 1))
      const ay = p.height * 0.12
      const chain: Node[] = []
      for (let i = 0; i < NODES; i++) {
        const x = ax + p.random(-2, 2)
        const y = ay + i * link
        chain.push({ x, y, px: x, py: y })
      }
      chains.push(chain)
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(46)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const f = p.frameCount
    const gust = (p.noise(f * 0.0024) - 0.5) * 2.6

    for (let s = 0; s < STRANDS; s++) {
      const chain = chains[s]
      const wind = gust + (p.noise(s * 4.7, f * 0.007) - 0.5) * 1.4
      for (let i = 1; i < NODES; i++) {
        const n = chain[i]
        const vx = (n.x - n.px) * 0.992
        const vy = (n.y - n.py) * 0.992
        n.px = n.x
        n.py = n.y
        n.x += vx + wind * (0.3 + (0.7 * i) / NODES)
        n.y += vy + GRAV
      }
      for (let k = 0; k < RELAX; k++) {
        for (let i = 1; i < NODES; i++) {
          const a = chain[i - 1]
          const b = chain[i]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d = Math.hypot(dx, dy) || 1
          const shift = (d - link) / d
          if (i === 1) {
            b.x -= dx * shift
            b.y -= dy * shift
          } else {
            a.x += dx * shift * 0.5
            a.y += dy * shift * 0.5
            b.x -= dx * shift * 0.5
            b.y -= dy * shift * 0.5
          }
        }
      }
    }

    const cyan = p.color(pal.signal)
    cyan.setAlpha(165)
    const orange = p.color(pal.accent)
    orange.setAlpha(200)
    const pin = p.color(pal.dim)
    pin.setAlpha(160)
    const lead = STRANDS >> 1

    for (let s = 0; s < STRANDS; s++) {
      const chain = chains[s]
      p.noFill()
      p.stroke(s === lead ? orange : cyan)
      p.strokeWeight(s === lead ? 1.6 : 1)
      p.beginShape()
      for (let i = 0; i < NODES; i++) p.vertex(chain[i].x, chain[i].y)
      p.endShape()

      const tip = chain[NODES - 1]
      p.noStroke()
      p.fill(s === lead ? orange : cyan)
      p.ellipse(tip.x, tip.y, 5)
      const head = chain[0]
      p.fill(pin)
      p.ellipse(head.x, head.y, 4)
    }
  }
}
