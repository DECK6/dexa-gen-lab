import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const NODES = 92
const PULSES = 9
const RANGE = 112

interface Node {
  x: number
  y: number
}

interface Pulse {
  from: number
  to: number
  prior: number
  t: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const nodes: Node[] = []
  const pulses: Pulse[] = []

  const nextHop = (at: number, prior: number) => {
    const choices: number[] = []
    for (let i = 0; i < nodes.length; i++) {
      if (i !== at && i !== prior && p.dist(nodes[at].x, nodes[at].y, nodes[i].x, nodes[i].y) < RANGE) choices.push(i)
    }
    return choices.length > 0 ? choices[Math.floor(p.random(choices.length))] : Math.floor(p.random(nodes.length))
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    const cols = 10
    for (let i = 0; i < NODES; i++) {
      nodes.push({
        x: p.width * (0.07 + (i % cols) * 0.095) + p.random(-16, 16),
        y: p.height * (0.09 + Math.floor(i / cols) * 0.095) + p.random(-16, 16),
      })
    }
    for (let i = 0; i < PULSES; i++) {
      const from = Math.floor(p.random(nodes.length))
      pulses.push({ from, to: nextHop(from, -1), prior: -1, t: p.random() })
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(46)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const f = p.frameCount
    const idle = p.color(pal.dim)
    idle.setAlpha(145)
    p.stroke(idle)
    p.strokeWeight(2)
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].x += (p.noise(i * 0.2, f * 0.003) - 0.5) * 0.3
      nodes[i].y += (p.noise(i * 0.2 + 20, f * 0.003) - 0.5) * 0.3
      p.point(nodes[i].x, nodes[i].y)
    }

    const path = p.color(pal.signal)
    const head = p.color(pal.accent)
    for (let i = 0; i < pulses.length; i++) {
      const pulse = pulses[i]
      const a = nodes[pulse.from]
      const b = nodes[pulse.to]
      pulse.t += 0.035
      const k = Math.min(pulse.t, 1)
      path.setAlpha(70 + Math.sin(k * Math.PI) * 150)
      p.stroke(path)
      p.strokeWeight(1)
      p.line(a.x, a.y, b.x, b.y)
      const x = p.lerp(a.x, b.x, k)
      const y = p.lerp(a.y, b.y, k)
      head.setAlpha(230)
      p.noFill()
      p.stroke(head)
      p.ellipse(x, y, 5 + Math.sin(k * Math.PI) * 8)
      if (pulse.t >= 1) {
        pulse.prior = pulse.from
        pulse.from = pulse.to
        pulse.to = nextHop(pulse.from, pulse.prior)
        pulse.t = 0
      }
    }
  }
}
