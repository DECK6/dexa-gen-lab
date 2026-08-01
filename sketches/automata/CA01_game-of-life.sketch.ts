import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 128
const CELLS = N * N
const AGE_MAX = 23
const GLOW_MAX = 9

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const age = new Uint8Array(CELLS)
  const glow = new Uint8Array(CELLS)
  const liveLut = new Uint8Array((AGE_MAX + 1) * 3)
  const deadLut = new Uint8Array((GLOW_MAX + 1) * 3)
  let calm = 0

  // random soup over a wrapped rect — used for the initial fill and for revivals
  const soup = (x0: number, y0: number, w: number, h: number, d: number) => {
    for (let y = y0; y < y0 + h; y++) {
      const row = ((((y % N) + N) % N)) * N
      for (let x = x0; x < x0 + w; x++) {
        const i = row + (((x % N) + N) % N)
        cur[i] = p.random() < d ? 1 : 0
        age[i] = 0
      }
    }
    calm = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    p.background(pal.bg)
    buf = p.createGraphics(N, N)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels

    const ac = p.color(pal.accent)
    const sg = p.color(pal.signal)
    const dm = p.color(pal.dim)
    const bgc = p.color(pal.bg)
    for (let i = 0; i <= AGE_MAX; i++) {
      const c = i < 4 ? p.lerpColor(ac, sg, i / 4) : p.lerpColor(sg, dm, (i - 4) / (AGE_MAX - 4))
      liveLut[i * 3] = p.red(c)
      liveLut[i * 3 + 1] = p.green(c)
      liveLut[i * 3 + 2] = p.blue(c)
    }
    for (let i = 0; i <= GLOW_MAX; i++) {
      const c = p.lerpColor(bgc, sg, (i / GLOW_MAX) * 0.34)
      deadLut[i * 3] = p.red(c)
      deadLut[i * 3 + 1] = p.green(c)
      deadLut[i * 3 + 2] = p.blue(c)
    }

    soup(0, 0, N, N, 0.32)
  }

  const step = () => {
    let changed = 0
    for (let y = 0; y < N; y++) {
      const up = (y === 0 ? N - 1 : y - 1) * N
      const dn = (y === N - 1 ? 0 : y + 1) * N
      const mid = y * N
      for (let x = 0; x < N; x++) {
        const xl = x === 0 ? N - 1 : x - 1
        const xr = x === N - 1 ? 0 : x + 1
        const n =
          cur[up + xl] + cur[up + x] + cur[up + xr] +
          cur[mid + xl] + cur[mid + xr] +
          cur[dn + xl] + cur[dn + x] + cur[dn + xr]
        const i = mid + x
        const was = cur[i]
        const now = was === 1 ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0
        nxt[i] = now
        if (now !== was) changed++
        if (now === 1) {
          age[i] = was === 1 ? (age[i] < AGE_MAX ? age[i] + 1 : AGE_MAX) : 0
          glow[i] = GLOW_MAX
        } else {
          age[i] = 0
          if (glow[i] > 0) glow[i]--
        }
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    return changed
  }

  const paint = () => {
    for (let i = 0; i < CELLS; i++) {
      const lut = cur[i] === 1 ? liveLut : deadLut
      const s = (cur[i] === 1 ? age[i] : glow[i]) * 3
      const o = i * 4
      px[o] = lut[s]
      px[o + 1] = lut[s + 1]
      px[o + 2] = lut[s + 2]
    }
  }

  p.draw = () => {
    const changed = step()
    // Life settles into still lifes and blinkers — revive when the board goes quiet
    if (changed < CELLS * 0.003) calm++
    else calm = 0
    if (calm > 45) soup(0, 0, N, N, 0.32)
    else if (p.frameCount % 260 === 0) {
      soup((p.random(N) | 0) - 13, (p.random(N) | 0) - 13, 26, 26, 0.45)
    }
    paint()
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
