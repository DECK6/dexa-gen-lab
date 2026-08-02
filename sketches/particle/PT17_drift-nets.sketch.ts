import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 126
const REACH = 76

interface Node {
  x: number
  y: number
  vx: number
  vy: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const nodes: Node[] = []
  const links = new Float32Array(COUNT * COUNT)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      const a = p.random(p.TWO_PI)
      nodes.push({ x: p.random(p.width), y: p.random(p.height), vx: Math.cos(a) * 0.5, vy: Math.sin(a) * 0.5 })
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(54)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const f = p.frameCount
    for (let i = 0; i < nodes.length; i++) {
      const o = nodes[i]
      const a = p.noise(i * 0.17, f * 0.0025) * p.TWO_PI * 2
      o.vx = o.vx * 0.97 + Math.cos(a) * 0.035
      o.vy = o.vy * 0.97 + Math.sin(a) * 0.035
      o.x = (o.x + o.vx + p.width) % p.width
      o.y = (o.y + o.vy + p.height) % p.height
    }

    const thread = p.color(pal.signal)
    p.strokeWeight(1)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        const d = Math.hypot(b.x - a.x, b.y - a.y)
        const k = i * COUNT + j
        links[k] = d < REACH ? Math.min(1, links[k] + 0.09) : Math.max(0, links[k] - 0.065)
        if (links[k] <= 0.02) continue
        thread.setAlpha(links[k] * (1 - Math.min(d / REACH, 1)) * 155)
        p.stroke(thread)
        p.line(a.x, a.y, b.x, b.y)
      }
    }

    const dot = p.color(pal.signal)
    dot.setAlpha(210)
    const hot = p.color(pal.accent)
    hot.setAlpha(220)
    p.strokeWeight(2)
    for (let i = 0; i < nodes.length; i++) {
      p.stroke(i % 23 === 0 ? hot : dot)
      p.point(nodes[i].x, nodes[i].y)
    }
  }
}
