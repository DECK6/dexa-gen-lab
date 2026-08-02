import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 120
const CELLS = N * N
const AGE = 24

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const age = new Uint8Array(CELLS)
  const lut = new Uint8Array((AGE + 1) * 3)
  const bgc = new Uint8Array(3)
  const hot = new Uint8Array(3)
  let calm = 0

  const seed = () => {
    for (let i = 0; i < CELLS; i++) {
      cur[i] = p.random() < 0.16 ? 1 : 0
      age[i] = 0
    }
    calm = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    buf = p.createGraphics(N, N)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels
    const bg = p.color(pal.bg)
    const sg = p.color(pal.signal)
    const dm = p.color(pal.dim)
    for (let i = 0; i <= AGE; i++) {
      const c = p.lerpColor(sg, dm, i / AGE)
      lut[i * 3] = p.red(c)
      lut[i * 3 + 1] = p.green(c)
      lut[i * 3 + 2] = p.blue(c)
    }
    const ac = p.color(pal.accent)
    bgc[0] = p.red(bg)
    bgc[1] = p.green(bg)
    bgc[2] = p.blue(bg)
    hot[0] = p.red(ac)
    hot[1] = p.green(ac)
    hot[2] = p.blue(ac)
    seed()
  }

  const step = () => {
    let moved = 0
    for (let y = 0; y < N; y++) {
      const up = (y === 0 ? N - 1 : y - 1) * N
      const dn = (y === N - 1 ? 0 : y + 1) * N
      const mid = y * N
      for (let x = 0; x < N; x++) {
        const xl = x === 0 ? N - 1 : x - 1
        const xr = x === N - 1 ? 0 : x + 1
        const i = mid + x
        const n = cur[up + xl] + cur[up + x] + cur[up + xr] +
          cur[mid + xl] + cur[mid + xr] + cur[dn + xl] + cur[dn + x] + cur[dn + xr]
        const on = cur[i] === 1 ? n >= 1 && n <= 5 : n === 3
        nxt[i] = on ? 1 : 0
        if (nxt[i] !== cur[i]) moved++
        age[i] = on ? (cur[i] === 1 ? Math.min(AGE, age[i] + 1) : 0) : Math.min(AGE, age[i] + 1)
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    calm = moved < 12 ? calm + 1 : 0
    if (calm > 32 || p.frameCount % 720 === 0) seed()
  }

  p.draw = () => {
    if (p.frameCount % 2 === 1) step()
    for (let i = 0; i < CELLS; i++) {
      const o = i * 4
      if (cur[i] === 1 && age[i] === 0) {
        px[o] = hot[0]
        px[o + 1] = hot[1]
        px[o + 2] = hot[2]
      } else if (cur[i] === 1) {
        const s = Math.min(AGE, age[i]) * 3
        px[o] = lut[s]
        px[o + 1] = lut[s + 1]
        px[o + 2] = lut[s + 2]
      } else {
        px[o] = bgc[0]
        px[o + 1] = bgc[1]
        px[o + 2] = bgc[2]
      }
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
