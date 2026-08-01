import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const G = 128
const SEEDS = 5
const TRIES = 380
const CAP = 0.36

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const occ = new Uint8Array(G * G)
  let frontier: number[] = []
  let cells: number[] = []
  let phase = 0
  let timer = 0
  let cw = 1

  const idx = (x: number, y: number) => y * G + x

  const reset = () => {
    occ.fill(0)
    frontier = []
    cells = []
    for (let i = 0; i < SEEDS; i++) {
      const x = Math.floor(p.random(G * 0.18, G * 0.82))
      const y = Math.floor(p.random(G * 0.18, G * 0.82))
      if (occ[idx(x, y)]) continue
      occ[idx(x, y)] = 1
      frontier.push(idx(x, y))
      cells.push(idx(x, y))
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

  const spread = () => {
    const mat = p.color(pal.signal)
    const rim = p.color(pal.accent)
    const t = p.frameCount * 0.002
    for (let n = 0; n < TRIES && frontier.length > 0; n++) {
      const fi = Math.floor(p.random(frontier.length))
      const src = frontier[fi]!
      const sx = src % G
      const sy = (src / G) | 0
      const dir = Math.floor(p.random(4))
      const tx = sx + (dir === 0 ? 1 : dir === 1 ? -1 : 0)
      const ty = sy + (dir === 2 ? 1 : dir === 3 ? -1 : 0)
      if (tx < 1 || ty < 1 || tx >= G - 1 || ty >= G - 1) continue
      const ti = idx(tx, ty)
      if (occ[ti]) {
        if (!open(sx, sy)) {
          frontier[fi] = frontier[frontier.length - 1]!
          frontier.pop()
        }
        continue
      }
      const lobe = p.noise(tx * 0.055, ty * 0.055, t)
      if (p.random() > lobe * 1.25 - 0.16) continue
      occ[ti] = 1
      frontier.push(ti)
      cells.push(ti)
      mat.setAlpha(60 + lobe * 120)
      p.fill(mat)
      p.rect(tx * cw, ty * cw, cw, cw)
      if (p.random() < 0.012) {
        rim.setAlpha(190)
        p.fill(rim)
        p.rect(tx * cw + cw * 0.25, ty * cw + cw * 0.25, cw * 0.6, cw * 0.6)
      }
    }
  }

  const open = (x: number, y: number) =>
    !occ[idx(x + 1, y)] || !occ[idx(x - 1, y)] || !occ[idx(x, y + 1)] || !occ[idx(x, y - 1)]

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(phase === 2 ? 24 : 5)
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    if (phase === 2) {
      if (++timer > 90) reset()
      return
    }
    if (phase === 0) {
      spread()
      if (cells.length > G * G * CAP || frontier.length === 0) {
        phase = 1
        timer = 0
      }
    } else if (++timer > 170) {
      phase = 2
      timer = 0
    }

    // Scintillation pass — the mat keeps breathing after growth stops.
    const mat = p.color(pal.signal)
    const t = p.frameCount * 0.012
    const scan = Math.min(900, cells.length)
    for (let n = 0; n < scan; n++) {
      const c = cells[Math.floor(p.random(cells.length))]!
      const x = c % G
      const y = (c / G) | 0
      const k = p.noise(x * 0.05, y * 0.05, t)
      mat.setAlpha(30 + k * 150)
      p.fill(mat)
      p.rect(x * cw, y * cw, cw, cw)
    }
  }
}
