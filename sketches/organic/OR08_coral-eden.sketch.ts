import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

// Eden growth model: random perimeter sites are occupied, biased toward exposed upper tips.
const G = 140
const ADDS = 30
const CAP = 3400

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const occ = new Uint8Array(G * G)
  let perim: number[] = []
  let cells: number[] = []
  let phase = 0
  let timer = 0
  let cw = 1

  const idx = (x: number, y: number) => y * G + x

  const neighbors = (x: number, y: number) => {
    let k = 0
    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        if ((ox === 0 && oy === 0) || x + ox < 0 || y + oy < 0 || x + ox >= G || y + oy >= G) continue
        if (occ[idx(x + ox, y + oy)]) k++
      }
    }
    return k
  }

  const reset = () => {
    occ.fill(0)
    perim = []
    cells = []
    const base = G - 3
    for (let i = -3; i <= 3; i++) {
      const x = (G >> 1) + i
      occ[idx(x, base)] = 1
      cells.push(idx(x, base))
      perim.push(idx(x, base - 1))
    }
    p.background(pal.bg)
    phase = 0
    timer = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    cw = p.width / G
    p.noStroke()
    reset()
  }

  const accrete = () => {
    const polyp = p.color(pal.signal)
    const tip = p.color(pal.accent)
    for (let n = 0; n < ADDS && perim.length > 0; n++) {
      const pi = Math.floor(p.random(perim.length))
      const site = perim[pi]!
      const x = site % G
      const y = (site / G) | 0
      perim[pi] = perim[perim.length - 1]!
      perim.pop()
      if (occ[site] || x < 1 || y < 1 || x >= G - 1 || y >= G - 1) continue
      const k = neighbors(x, y)
      if (k === 0) continue
      const rise = 0.34 + 0.92 * (1 - y / G)
      if (p.random() > (1 / (1 + k * 0.8)) * rise) {
        perim.push(site)
        continue
      }
      occ[site] = 1
      cells.push(site)
      polyp.setAlpha(90 + k * 16)
      p.fill(polyp)
      const r = cw * (0.7 + k * 0.11)
      p.ellipse(x * cw + cw / 2, y * cw + cw / 2, r, r)
      if (k <= 2) {
        tip.setAlpha(180)
        p.fill(tip)
        p.ellipse(x * cw + cw / 2, y * cw + cw / 2, cw * 0.7, cw * 0.7)
      }
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          if (ox !== 0 && oy !== 0) continue
          const q = idx(x + ox, y + oy)
          if (!occ[q]) perim.push(q)
        }
      }
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(phase === 2 ? 24 : 4)
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    if (phase === 2) {
      if (++timer > 90) reset()
      return
    }
    if (phase === 0) {
      accrete()
      if (cells.length >= CAP || perim.length === 0) {
        phase = 1
        timer = 0
      }
    } else if (++timer > 170) {
      phase = 2
      timer = 0
    }

    // Polyp shimmer keeps the colony alive once accretion stops.
    const polyp = p.color(pal.signal)
    const t = p.frameCount * 0.02
    const scan = Math.min(700, cells.length)
    for (let n = 0; n < scan; n++) {
      const c = cells[Math.floor(p.random(cells.length))]!
      const x = c % G
      const y = (c / G) | 0
      const k = p.noise(x * 0.09, y * 0.09, t)
      polyp.setAlpha(40 + k * 140)
      p.fill(polyp)
      p.ellipse(x * cw + cw / 2, y * cw + cw / 2, cw * (0.6 + k * 0.9), cw * (0.6 + k * 0.9))
    }
  }
}
