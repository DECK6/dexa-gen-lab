import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MAX_NODES = 1200
const SPACING = 7
const REPEL = 13
const GROW = 3
const CELL = 14

type Node = { x: number; y: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let nodes: Node[] = []
  let sparks: { x: number; y: number; life: number }[] = []
  let phase = 0
  let timer = 0

  const reset = () => {
    nodes = []
    sparks = []
    const n = 64
    const r = Math.min(p.width, p.height) * 0.13
    for (let i = 0; i < n; i++) {
      const a = (i / n) * p.TWO_PI
      nodes.push({ x: p.width / 2 + Math.cos(a) * r, y: p.height / 2 + Math.sin(a) * r })
    }
    p.background(pal.bg)
    phase = 0
    timer = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    reset()
  }

  const step = () => {
    const n = nodes.length
    const fx = new Float32Array(n)
    const fy = new Float32Array(n)
    const grid = new Map<number, number[]>()
    for (let i = 0; i < n; i++) {
      const k = Math.floor(nodes[i]!.x / CELL) * 4096 + Math.floor(nodes[i]!.y / CELL)
      const bin = grid.get(k)
      if (bin) bin.push(i)
      else grid.set(k, [i])
    }
    for (let i = 0; i < n; i++) {
      const a = nodes[i]!
      const cx = Math.floor(a.x / CELL)
      const cy = Math.floor(a.y / CELL)
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const bin = grid.get((cx + ox) * 4096 + (cy + oy))
          if (!bin) continue
          for (let bi = 0; bi < bin.length; bi++) {
            const j = bin[bi]!
            if (j === i) continue
            const b = nodes[j]!
            const dx = a.x - b.x
            const dy = a.y - b.y
            const d2 = dx * dx + dy * dy
            if (d2 > REPEL * REPEL || d2 < 0.0001) continue
            const d = Math.sqrt(d2)
            const w = ((REPEL - d) / REPEL) * 0.6
            fx[i] += (dx / d) * w
            fy[i] += (dy / d) * w
          }
        }
      }
      const prev = nodes[(i - 1 + n) % n]!
      const next = nodes[(i + 1) % n]!
      fx[i] += ((prev.x + next.x) * 0.5 - a.x) * 0.26
      fy[i] += ((prev.y + next.y) * 0.5 - a.y) * 0.26
    }
    const t = p.frameCount * 0.003
    for (let i = 0; i < n; i++) {
      const a = nodes[i]!
      const ang = p.noise(a.x * 0.005, a.y * 0.005, t) * p.TWO_PI * 2
      a.x = p.constrain(a.x + fx[i] + Math.cos(ang) * 0.2, 8, p.width - 8)
      a.y = p.constrain(a.y + fy[i] + Math.sin(ang) * 0.2, 8, p.height - 8)
    }
    if (n >= MAX_NODES) return
    // Node injection is the growth driver: crowding forces the ring to buckle.
    for (let g = 0; g < GROW && nodes.length < MAX_NODES; g++) {
      const i = Math.floor(p.random(nodes.length))
      const a = nodes[i]!
      const b = nodes[(i + 1) % nodes.length]!
      if (p.random() > p.noise(a.x * 0.004, a.y * 0.004)) continue
      const mx = (a.x + b.x) * 0.5
      const my = (a.y + b.y) * 0.5
      nodes.splice(i + 1, 0, { x: mx, y: my })
      if (p.random() < 0.3) sparks.push({ x: mx, y: my, life: 26 })
    }
    const out: Node[] = []
    const m = nodes.length
    for (let i = 0; i < m; i++) {
      const a = nodes[i]!
      const b = nodes[(i + 1) % m]!
      out.push(a)
      if (out.length + (m - i) >= MAX_NODES) continue
      if (Math.hypot(b.x - a.x, b.y - a.y) < SPACING) continue
      out.push({ x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 })
    }
    nodes = out
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(phase === 2 ? 30 : 16)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    if (phase === 0) {
      step()
      if (nodes.length >= MAX_NODES) phase = 1
    } else if (phase === 1) {
      if (++timer > 150) {
        phase = 2
        timer = 0
      }
    } else {
      if (++timer > 80) reset()
      return
    }

    const ring = p.color(pal.signal)
    ring.setAlpha(140)
    p.stroke(ring)
    p.strokeWeight(1)
    p.noFill()
    p.beginShape()
    for (const nd of nodes) p.vertex(nd.x, nd.y)
    p.endShape(p.CLOSE)

    const bud = p.color(pal.accent)
    p.noStroke()
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]!
      s.life--
      if (s.life <= 0) sparks.splice(i, 1)
      bud.setAlpha(Math.max(0, s.life) * 8)
      p.fill(bud)
      p.ellipse(s.x, s.y, 2.6, 2.6)
    }
  }
}
