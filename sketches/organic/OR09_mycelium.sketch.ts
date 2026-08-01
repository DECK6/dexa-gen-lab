import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MAX_TIPS = 74
const MAX_PTS = 7000
const CELL = 9
const FUSE = 3.2
const SPORES = 22

type Tip = { x: number; y: number; a: number; id: number; age: number }
type Pt = { x: number; y: number; id: number; age: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let tips: Tip[] = []
  let grid = new Map<number, Pt[]>()
  let all: Pt[] = []
  let spores: { x: number; y: number; a: number }[] = []
  let nextId = 0
  let phase = 0
  let timer = 0

  const reset = () => {
    tips = []
    grid = new Map()
    all = []
    spores = []
    nextId = 0
    for (let i = 0; i < 4; i++) {
      const x = p.width * 0.5 + p.random(-40, 40)
      const y = p.height * 0.5 + p.random(-40, 40)
      tips.push({ x, y, a: p.random(p.TWO_PI), id: nextId++, age: 0 })
    }
    p.background(pal.bg)
    phase = 0
    timer = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    reset()
  }

  const meets = (x: number, y: number, id: number, age: number) => {
    const cx = Math.floor(x / CELL)
    const cy = Math.floor(y / CELL)
    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const bin = grid.get((cx + ox) * 4096 + (cy + oy))
        if (!bin) continue
        for (let i = 0; i < bin.length; i++) {
          const q = bin[i]!
          if (q.id === id && age - q.age < 70) continue
          if ((q.x - x) ** 2 + (q.y - y) ** 2 < FUSE * FUSE) return true
        }
      }
    }
    return false
  }

  const deposit = (x: number, y: number, id: number, age: number) => {
    const pt = { x, y, id, age }
    const k = Math.floor(x / CELL) * 4096 + Math.floor(y / CELL)
    const bin = grid.get(k)
    if (bin) bin.push(pt)
    else grid.set(k, [pt])
    all.push(pt)
  }

  const extend = () => {
    const t = p.frameCount * 0.004
    const hypha = p.color(pal.signal)
    hypha.setAlpha(105)
    const fuse = p.color(pal.accent)
    fuse.setAlpha(200)
    for (let i = tips.length - 1; i >= 0; i--) {
      const tp = tips[i]!
      tp.a += (p.noise(tp.x * 0.008, tp.y * 0.008, t) - 0.5) * 0.62
      const nxp = tp.x + Math.cos(tp.a) * 1.9
      const nyp = tp.y + Math.sin(tp.a) * 1.9
      if (nxp < 4 || nyp < 4 || nxp > p.width - 4 || nyp > p.height - 4) {
        tips.splice(i, 1)
        continue
      }
      tp.age++
      // Young branches start inside the parent hypha — hold off fusion until they are clear of it.
      if (tp.age > 20 && meets(nxp, nyp, tp.id, tp.age)) {
        p.noStroke()
        p.fill(fuse)
        p.ellipse(nxp, nyp, 4.2, 4.2)
        tips.splice(i, 1)
        continue
      }
      p.stroke(hypha)
      p.strokeWeight(0.9)
      p.line(tp.x, tp.y, nxp, nyp)
      deposit(nxp, nyp, tp.id, tp.age)
      tp.x = nxp
      tp.y = nyp
      if (tips.length < MAX_TIPS && p.random() < 0.021)
        tips.push({ x: tp.x, y: tp.y, a: tp.a + p.random(-1, 1) * 0.8, id: nextId++, age: 0 })
    }
    // Fused and stranded tips are replaced by fresh hyphae sprouting off the existing network.
    while (tips.length < 14 && all.length > 0 && all.length < MAX_PTS) {
      const q = all[Math.floor(p.random(all.length))]!
      tips.push({ x: q.x, y: q.y, a: p.random(p.TWO_PI), id: nextId++, age: 0 })
    }
  }

  const drift = () => {
    while (spores.length < SPORES && all.length > 0) {
      const q = all[Math.floor(p.random(all.length))]!
      spores.push({ x: q.x, y: q.y, a: p.random(p.TWO_PI) })
    }
    const dust = p.color(pal.paper)
    dust.setAlpha(70)
    p.stroke(dust)
    p.strokeWeight(1)
    for (const s of spores) {
      s.a += (p.noise(s.x * 0.01, s.y * 0.01, p.frameCount * 0.01) - 0.5) * 0.5
      s.x += Math.cos(s.a) * 0.7
      s.y += Math.sin(s.a) * 0.7 - 0.25
      p.point(s.x, s.y)
    }
  }

  p.draw = () => {
    if (phase === 2) {
      const veil = p.color(pal.bg)
      veil.setAlpha(26)
      p.noStroke()
      p.fill(veil)
      p.rect(0, 0, p.width, p.height)
    }

    if (phase === 0) {
      extend()
      if (tips.length === 0 || all.length >= MAX_PTS) {
        phase = 1
        timer = 0
      }
    } else if (phase === 1) {
      drift()
      if (++timer > 150) {
        phase = 2
        timer = 0
      }
    } else if (++timer > 90) reset()
  }
}
