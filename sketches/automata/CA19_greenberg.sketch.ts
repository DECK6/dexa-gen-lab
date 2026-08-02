import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 96
const CELLS = N * N
const STATES = 18

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const lut = new Uint8Array(STATES * 3)

  const excite = (cx: number, cy: number) => {
    for (let y = cy - 2; y <= cy + 2; y++) for (let x = cx - 2; x <= cx + 2; x++) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= 4) cur[((y + N) % N) * N + (x + N) % N] = 1
    }
  }

  const seed = () => {
    cur.fill(0)
    for (let k = 0; k < 150; k++) cur[p.random(CELLS) | 0] = 1 + (p.random(STATES - 1) | 0)
    excite(N >> 1, N >> 1)
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
    for (let i = 0; i < STATES; i++) {
      const c = i === 0 ? bg : i === 1 ? p.color(pal.accent) : p.lerpColor(sg, bg, (i - 2) / STATES)
      lut[i * 3] = p.red(c)
      lut[i * 3 + 1] = p.green(c)
      lut[i * 3 + 2] = p.blue(c)
    }
    seed()
  }

  const step = () => {
    let fronts = 0
    for (let y = 0; y < N; y++) {
      const up = (y === 0 ? N - 1 : y - 1) * N
      const dn = (y === N - 1 ? 0 : y + 1) * N
      const mid = y * N
      for (let x = 0; x < N; x++) {
        const i = mid + x
        if (cur[i] > 0) nxt[i] = (cur[i] + 1) % STATES
        else {
          const xl = x === 0 ? N - 1 : x - 1
          const xr = x === N - 1 ? 0 : x + 1
          const hit = cur[up + x] === 1 || cur[dn + x] === 1 || cur[mid + xl] === 1 || cur[mid + xr] === 1
          nxt[i] = hit ? 1 : 0
        }
        if (nxt[i] === 1) fronts++
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    if (fronts === 0) excite(N >> 1, N >> 1)
  }

  p.draw = () => {
    step()
    if (p.frameCount % 42 === 0) excite(p.frameCount % 84 === 0 ? N / 3 : N * 2 / 3, N / 2)
    if (p.frameCount % 900 === 0) seed()
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
