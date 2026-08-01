import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Pt {
  x: number
  y: number
}

const DEPTH = 4 // subdivision cap: 3 * 4^4 = 768 vertices per ring
const RINGS = 3
const PEAK = 0.288675 // (1/3) * sin(60deg) — equilateral bump height per edge

// One Koch pass. f in [0,1] blends the new peak from flat (previous generation)
// to a full equilateral bump (next generation).
function subdivide(src: Pt[], f: number): Pt[] {
  const out: Pt[] = []
  const n = src.length
  for (let i = 0; i < n; i++) {
    const a = src[i]!
    const b = src[(i + 1) % n]!
    const ex = b.x - a.x
    const ey = b.y - a.y
    const p1 = { x: a.x + ex / 3, y: a.y + ey / 3 }
    const p2 = { x: a.x + (ex * 2) / 3, y: a.y + (ey * 2) / 3 }
    const k = PEAK * f
    out.push(a, p1, { x: (p1.x + p2.x) / 2 + ey * k, y: (p1.y + p2.y) / 2 - ex * k }, p2)
  }
  return out
}

function seedTri(r: number, phase: number): Pt[] {
  const tri: Pt[] = []
  for (let i = 0; i < 3; i++) {
    const a = phase - Math.PI / 2 + (i * Math.PI * 2) / 3
    tri.push({ x: Math.cos(a) * r, y: Math.sin(a) * r })
  }
  return tri
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const spin: number[] = []
  const scales: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let r = 0; r < RINGS; r++) {
      spin.push(p.random(-0.004, 0.004) + (r % 2 ? 0.0018 : -0.0018))
      scales.push(1 - r * 0.34)
    }
    p.noFill()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(26)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    p.noFill()

    const base = p.height * 0.34
    const clock = p.frameCount * 0.007

    for (let r = 0; r < RINGS; r++) {
      // Continuous generation index: each level blends in one at a time.
      const gen = 0.6 + 3.2 * (0.5 - 0.5 * Math.cos(clock + r * 1.1))
      let pts = seedTri(base * scales[r]!, p.frameCount * spin[r]!)
      for (let d = 0; d < DEPTH; d++) pts = subdivide(pts, p.constrain(gen - d, 0, 1))

      const c = p.color(r === RINGS - 1 ? pal.accent : pal.signal)
      c.setAlpha(r === 0 ? 190 : 130 - r * 20)
      p.stroke(c)
      p.strokeWeight(r === 0 ? 1.2 : 0.9)

      p.push()
      p.translate(p.width / 2, p.height / 2)
      p.beginShape()
      for (const q of pts) p.vertex(q.x, q.y)
      p.endShape(p.CLOSE)
      p.pop()
    }
  }
}
