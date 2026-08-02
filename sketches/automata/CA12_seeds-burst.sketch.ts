import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 128
const CELLS = N * N
const GLOW = 10

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const glow = new Uint8Array(CELLS)
  const trail = new Uint8Array((GLOW + 1) * 3)
  const hot = new Uint8Array(3)

  const ignite = (amount: number) => {
    for (let k = 0; k < amount; k++) {
      const x = 8 + (p.random(N - 16) | 0)
      const y = 8 + (p.random(N - 16) | 0)
      cur[y * N + x] = 1
      cur[y * N + x + (p.random() < 0.5 ? 1 : N)] = 1
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
    const bg = p.color(pal.bg)
    const sg = p.color(pal.signal)
    const ac = p.color(pal.accent)
    for (let i = 0; i <= GLOW; i++) {
      const c = p.lerpColor(bg, sg, (i / GLOW) * 0.75)
      trail[i * 3] = p.red(c)
      trail[i * 3 + 1] = p.green(c)
      trail[i * 3 + 2] = p.blue(c)
    }
    hot[0] = p.red(ac)
    hot[1] = p.green(ac)
    hot[2] = p.blue(ac)
    ignite(520)
  }

  const step = () => {
    let births = 0
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
        const born = cur[i] === 0 && n === 2 ? 1 : 0
        nxt[i] = born
        if (born === 1) {
          glow[i] = GLOW
          births++
        }
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    if (births < 18 || p.frameCount % 64 === 0) ignite(80)
  }

  p.draw = () => {
    if (p.frameCount % 2 === 1) step()
    for (let i = 0; i < CELLS; i++) {
      const o = i * 4
      if (cur[i] === 1) {
        px[o] = hot[0]
        px[o + 1] = hot[1]
        px[o + 2] = hot[2]
      } else {
        const s = glow[i] * 3
        px[o] = trail[s]
        px[o + 1] = trail[s + 1]
        px[o + 2] = trail[s + 2]
        if (glow[i] > 0) glow[i]--
      }
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
