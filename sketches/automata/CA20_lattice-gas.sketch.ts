import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 112
const CELLS = N * N
const PARTICLES = 2200
const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const wall = new Uint8Array(CELLS)
  const flash = new Uint8Array(CELLS)
  const pop = new Uint8Array(16)
  const tone = new Uint8Array(15)

  const makeWalls = () => {
    for (let x = 0; x < N; x++) wall[x] = wall[(N - 1) * N + x] = 1
    for (let y = 0; y < N; y++) wall[y * N] = wall[y * N + N - 1] = 1
    for (let y = 12; y < N - 12; y++) {
      if (y < 43 || y > 57) wall[y * N + 37] = 1
      if (y < 56 || y > 70) wall[y * N + 74] = 1
    }
    for (let x = 45; x < 67; x++) wall[28 * N + x] = wall[84 * N + x] = 1
  }

  const seed = () => {
    cur.fill(0)
    flash.fill(0)
    let count = 0
    while (count < PARTICLES) {
      const x = 2 + (p.random(N - 4) | 0)
      const y = 2 + (p.random(N - 4) | 0)
      const i = y * N + x
      const bit = 1 << (p.random(4) | 0)
      if (wall[i] === 0 && (cur[i] & bit) === 0) {
        cur[i] |= bit
        count++
      }
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    buf = p.createGraphics(N, N)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels
    for (let mask = 0; mask < 16; mask++) for (let d = 0; d < 4; d++) pop[mask] += (mask >> d) & 1
    const colors = [p.color(pal.bg), p.color(pal.signal),
      p.lerpColor(p.color(pal.signal), p.color(pal.paper), 0.28), p.color(pal.paper), p.color(pal.dim)]
    for (let i = 0; i < colors.length; i++) {
      tone[i * 3] = p.red(colors[i])
      tone[i * 3 + 1] = p.green(colors[i])
      tone[i * 3 + 2] = p.blue(colors[i])
    }
    makeWalls()
    seed()
  }

  const stream = () => {
    nxt.fill(0)
    for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
      const i = y * N + x
      if (wall[i] === 1) continue
      let mask = cur[i]
      if (mask === 5) {
        mask = 10
        flash[i] = 5
      } else if (mask === 10) {
        mask = 5
        flash[i] = 5
      }
      for (let d = 0; d < 4; d++) if ((mask & (1 << d)) !== 0) {
        const j = (y + DY[d]) * N + x + DX[d]
        if (wall[j] === 1) nxt[i] |= 1 << ((d + 2) & 3)
        else nxt[j] |= 1 << d
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
  }

  p.draw = () => {
    stream()
    if (p.frameCount % 900 === 0) seed()
    const ac = p.color(pal.accent)
    for (let i = 0; i < CELLS; i++) {
      const o = i * 4
      const s = (wall[i] === 1 ? 4 : Math.min(3, pop[cur[i]])) * 3
      px[o] = flash[i] > 0 ? p.red(ac) : tone[s]
      px[o + 1] = flash[i] > 0 ? p.green(ac) : tone[s + 1]
      px[o + 2] = flash[i] > 0 ? p.blue(ac) : tone[s + 2]
      if (flash[i] > 0) flash[i]--
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
