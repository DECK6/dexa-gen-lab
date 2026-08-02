import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 96
const CELLS = N * N
const MAX_STATE = 63
const GROWTH = 7

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const lut = new Uint8Array((MAX_STATE + 1) * 3)

  const seed = () => {
    cur.fill(0)
    for (let k = 0; k < 820; k++) cur[p.random(CELLS) | 0] = 1 + (p.random(MAX_STATE) | 0)
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
    const ink = p.color(pal.ink)
    const sg = p.color(pal.signal)
    const ac = p.color(pal.accent)
    for (let i = 0; i <= MAX_STATE; i++) {
      const t = i / MAX_STATE
      const c = i === 0 ? bg : i === MAX_STATE ? ac : p.lerpColor(ink, sg, 0.25 + 0.75 * Math.sqrt(t))
      lut[i * 3] = p.red(c)
      lut[i * 3 + 1] = p.green(c)
      lut[i * 3 + 2] = p.blue(c)
    }
    seed()
  }

  const step = () => {
    let active = 0
    for (let y = 0; y < N; y++) {
      const up = (y === 0 ? N - 1 : y - 1) * N
      const dn = (y === N - 1 ? 0 : y + 1) * N
      const mid = y * N
      for (let x = 0; x < N; x++) {
        const xl = x === 0 ? N - 1 : x - 1
        const xr = x === N - 1 ? 0 : x + 1
        const i = mid + x
        const v0 = cur[up + xl]
        const v1 = cur[up + x]
        const v2 = cur[up + xr]
        const v3 = cur[mid + xl]
        const v4 = cur[mid + xr]
        const v5 = cur[dn + xl]
        const v6 = cur[dn + x]
        const v7 = cur[dn + xr]
        const ill = (v0 === MAX_STATE ? 1 : 0) + (v1 === MAX_STATE ? 1 : 0) +
          (v2 === MAX_STATE ? 1 : 0) + (v3 === MAX_STATE ? 1 : 0) +
          (v4 === MAX_STATE ? 1 : 0) + (v5 === MAX_STATE ? 1 : 0) +
          (v6 === MAX_STATE ? 1 : 0) + (v7 === MAX_STATE ? 1 : 0)
        const infected = (v0 > 0 && v0 < MAX_STATE ? 1 : 0) + (v1 > 0 && v1 < MAX_STATE ? 1 : 0) +
          (v2 > 0 && v2 < MAX_STATE ? 1 : 0) + (v3 > 0 && v3 < MAX_STATE ? 1 : 0) +
          (v4 > 0 && v4 < MAX_STATE ? 1 : 0) + (v5 > 0 && v5 < MAX_STATE ? 1 : 0) +
          (v6 > 0 && v6 < MAX_STATE ? 1 : 0) + (v7 > 0 && v7 < MAX_STATE ? 1 : 0)
        const sum = cur[i] + v0 + v1 + v2 + v3 + v4 + v5 + v6 + v7
        if (cur[i] === 0) nxt[i] = Math.min(MAX_STATE, Math.floor(infected / 2) + ill * 2)
        else if (cur[i] === MAX_STATE) nxt[i] = 0
        else nxt[i] = Math.min(MAX_STATE, Math.floor(sum / (infected + ill + 1)) + GROWTH)
        if (nxt[i] > 0) active++
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    if (active < 80 || p.frameCount % 900 === 0) seed()
  }

  p.draw = () => {
    step()
    for (let i = 0; i < CELLS; i++) {
      const s = cur[i] * 3
      const o = i * 4
      px[o] = lut[s]
      px[o + 1] = lut[s + 1]
      px[o + 2] = lut[s + 2]
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
