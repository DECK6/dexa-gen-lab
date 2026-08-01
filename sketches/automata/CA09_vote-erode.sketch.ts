import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 128
const CELLS = N * N
const FLIPS = 96

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const flag = new Uint8Array(CELLS)
  const tone = new Uint8Array(4 * 3)
  const hot = new Uint8Array(3)
  let calm = 0

  const scramble = (x0: number, y0: number, w: number, hgt: number) => {
    for (let y = y0; y < y0 + hgt; y++) {
      const row = ((((y % N) + N) % N)) * N
      for (let x = x0; x < x0 + w; x++) {
        cur[row + (((x % N) + N) % N)] = p.random() < 0.5 ? 1 : 0
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

    const bgc = p.color(pal.bg)
    const ink = p.color(pal.ink)
    const dm = p.color(pal.dim)
    const sg = p.color(pal.signal)
    const ac = p.color(pal.accent)
    // index = state | edge<<1 : void, island body, void shore, island rim
    const steps = [bgc, p.lerpColor(ink, sg, 0.55), p.lerpColor(bgc, dm, 0.75), sg]
    for (let i = 0; i < 4; i++) {
      const c = steps[i]
      tone[i * 3] = p.red(c)
      tone[i * 3 + 1] = p.green(c)
      tone[i * 3 + 2] = p.blue(c)
    }
    hot[0] = p.red(ac)
    hot[1] = p.green(ac)
    hot[2] = p.blue(ac)

    scramble(0, 0, N, N)
  }

  // majority of the 3x3 block including self — 9 votes, so no ties
  const vote = () => {
    let moved = 0
    for (let y = 0; y < N; y++) {
      const up = (y === 0 ? N - 1 : y - 1) * N
      const dn = (y === N - 1 ? 0 : y + 1) * N
      const mid = y * N
      for (let x = 0; x < N; x++) {
        const xl = x === 0 ? N - 1 : x - 1
        const xr = x === N - 1 ? 0 : x + 1
        const i = mid + x
        const sum =
          cur[up + xl] + cur[up + x] + cur[up + xr] +
          cur[mid + xl] + cur[i] + cur[mid + xr] +
          cur[dn + xl] + cur[dn + x] + cur[dn + xr]
        const v = sum >= 5 ? 1 : 0
        nxt[i] = v
        const changed = v !== cur[i] ? 1 : 0
        moved += changed
        flag[i] = changed | (sum !== 0 && sum !== 9 ? 2 : 0)
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    // thermal noise keeps the coastlines eroding instead of freezing solid
    for (let k = 0; k < FLIPS; k++) {
      const i = p.random(CELLS) | 0
      cur[i] = cur[i] === 1 ? 0 : 1
      flag[i] |= 1
    }
    if (moved < 24) calm++
    else calm = 0
    if (calm > 40) scramble(0, 0, N, N)
  }

  p.draw = () => {
    if (p.frameCount % 3 === 1) vote()
    if (p.frameCount % 240 === 0) scramble((p.random(N) | 0) - 20, (p.random(N) | 0) - 20, 40, 40)

    for (let i = 0; i < CELLS; i++) {
      const o = i * 4
      const f = flag[i]
      if ((f & 1) === 1) {
        px[o] = hot[0]
        px[o + 1] = hot[1]
        px[o + 2] = hot[2]
      } else {
        const s = (cur[i] | (f & 2)) * 3
        px[o] = tone[s]
        px[o + 1] = tone[s + 1]
        px[o + 2] = tone[s + 2]
      }
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
