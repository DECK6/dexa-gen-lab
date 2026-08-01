import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 128
const CELLS = N * N
const K = 12

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const lut = new Uint8Array(K * 3)

  const scramble = (x0: number, y0: number, w: number, hgt: number) => {
    for (let y = y0; y < y0 + hgt; y++) {
      const row = ((((y % N) + N) % N)) * N
      for (let x = x0; x < x0 + w; x++) {
        cur[row + (((x % N) + N) % N)] = p.random(K) | 0
      }
    }
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

    const ink = p.color(pal.ink)
    const sg = p.color(pal.signal)
    const ac = p.color(pal.accent)
    for (let i = 0; i < K; i++) {
      // state 0 marks the wave crest; 1..K-1 ramp out of the dark so the arms read as depth
      const c = i === 0 ? ac : p.lerpColor(ink, sg, (i - 1) / (K - 2))
      lut[i * 3] = p.red(c)
      lut[i * 3 + 1] = p.green(c)
      lut[i * 3 + 2] = p.blue(c)
    }
    scramble(0, 0, N, N)
  }

  // cyclic CA: a cell advances to its successor state as soon as one Moore neighbour holds it
  const step = () => {
    for (let y = 0; y < N; y++) {
      const up = (y === 0 ? N - 1 : y - 1) * N
      const dn = (y === N - 1 ? 0 : y + 1) * N
      const mid = y * N
      for (let x = 0; x < N; x++) {
        const i = mid + x
        const s = cur[i]
        const want = s + 1 === K ? 0 : s + 1
        const xl = x === 0 ? N - 1 : x - 1
        const xr = x === N - 1 ? 0 : x + 1
        const beat =
          cur[up + xl] === want || cur[up + x] === want || cur[up + xr] === want ||
          cur[mid + xl] === want || cur[mid + xr] === want ||
          cur[dn + xl] === want || cur[dn + x] === want || cur[dn + xr] === want
        nxt[i] = beat ? want : s
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
  }

  p.draw = () => {
    if (p.frameCount % 2 === 1) step()
    if (p.frameCount % 720 === 0) {
      scramble((p.random(N) | 0) - 18, (p.random(N) | 0) - 18, 36, 36)
    }
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
