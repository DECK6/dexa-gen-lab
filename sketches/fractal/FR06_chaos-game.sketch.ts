import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Mode {
  n: number
  r: number
  noRepeat: boolean
}
interface Pt {
  x: number
  y: number
}

// Contraction ratios that give the classic n-flake for each vertex count.
const MODES: Mode[] = [
  { n: 3, r: 0.5, noRepeat: false },
  { n: 4, r: 0.5, noRepeat: true },
  { n: 5, r: 0.382, noRepeat: false },
  { n: 6, r: 1 / 3, noRepeat: false },
]
const PER_FRAME = 2400
const DWELL = 470
const CROSS = 64 // cross-dissolve frames when a new vertex count takes over

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const verts: Pt[] = []
  let mi = 0
  let timer = 0
  let prev = 0
  let px = 0
  let py = 0

  const layout = () => {
    verts.length = 0
    const m = MODES[mi]!
    const rad = Math.min(p.width, p.height) * 0.43
    const spin = -p.HALF_PI + p.random(-0.4, 0.4)
    for (let i = 0; i < m.n; i++) {
      const a = spin + (i * p.TWO_PI) / m.n
      verts.push({ x: p.width / 2 + Math.cos(a) * rad, y: p.height / 2 + Math.sin(a) * rad })
    }
    px = p.width / 2
    py = p.height / 2
    prev = 0
  }

  const veil = (a: number) => {
    const c = p.color(pal.bg)
    c.setAlpha(a)
    p.noStroke()
    p.fill(c)
    p.rect(0, 0, p.width, p.height)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    mi = Math.floor(p.random(MODES.length))
    layout()
  }

  p.draw = () => {
    if (timer < CROSS) veil(26)
    else if (timer % 7 === 0) veil(3)

    const m = MODES[mi]!
    const cyan = p.color(pal.signal)
    cyan.setAlpha(62)
    const orange = p.color(pal.accent)
    orange.setAlpha(150)
    p.strokeWeight(1)
    p.stroke(cyan)

    for (let i = 0; i < PER_FRAME; i++) {
      const k = m.noRepeat
        ? (prev + 1 + Math.floor(p.random(m.n - 1))) % m.n
        : Math.floor(p.random(m.n))
      const v = verts[k]!
      px += (v.x - px) * m.r
      py += (v.y - py) * m.r
      prev = k
      if (i % 149 === 0) {
        p.stroke(orange)
        p.point(px, py)
        p.stroke(cyan)
      } else {
        p.point(px, py)
      }
    }

    const mark = p.color(pal.accent)
    mark.setAlpha(70)
    p.stroke(mark)
    p.noFill()
    p.strokeWeight(1)
    for (const v of verts) p.circle(v.x, v.y, 9)

    if (++timer >= DWELL) {
      timer = 0
      mi = (mi + 1) % MODES.length
      layout()
    }
  }
}
