import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 128
const CELLS = N * N
const GLOW = 11

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const fire = new Uint8Array(CELLS)
  const glow = new Uint8Array(CELLS)
  const restLut = new Uint8Array((GLOW + 1) * 3)
  const hot = new Uint8Array(3)
  const dying = new Uint8Array(3)
  let calm = 0

  const seed = () => {
    for (let i = 0; i < CELLS; i++) {
      const r = p.random()
      cur[i] = r < 0.14 ? 1 : r < 0.2 ? 2 : 0
      glow[i] = 0
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
    const sg = p.color(pal.signal)
    const ac = p.color(pal.accent)
    for (let i = 0; i <= GLOW; i++) {
      const c = p.lerpColor(bgc, sg, (i / GLOW) * 0.32)
      restLut[i * 3] = p.red(c)
      restLut[i * 3 + 1] = p.green(c)
      restLut[i * 3 + 2] = p.blue(c)
    }
    hot[0] = p.red(ac)
    hot[1] = p.green(ac)
    hot[2] = p.blue(ac)
    dying[0] = p.red(sg)
    dying[1] = p.green(sg)
    dying[2] = p.blue(sg)
    seed()
  }

  // firing -> dying -> ready; a ready cell ignites on exactly two firing Moore neighbours
  const step = () => {
    for (let i = 0; i < CELLS; i++) fire[i] = cur[i] === 1 ? 1 : 0
    let live = 0
    for (let y = 0; y < N; y++) {
      const up = (y === 0 ? N - 1 : y - 1) * N
      const dn = (y === N - 1 ? 0 : y + 1) * N
      const mid = y * N
      for (let x = 0; x < N; x++) {
        const i = mid + x
        const s = cur[i]
        if (s === 1) {
          nxt[i] = 2
          continue
        }
        if (s === 2) {
          nxt[i] = 0
          continue
        }
        const xl = x === 0 ? N - 1 : x - 1
        const xr = x === N - 1 ? 0 : x + 1
        const n =
          fire[up + xl] + fire[up + x] + fire[up + xr] +
          fire[mid + xl] + fire[mid + xr] +
          fire[dn + xl] + fire[dn + x] + fire[dn + xr]
        const on = n === 2 ? 1 : 0
        nxt[i] = on
        live += on
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    for (let i = 0; i < CELLS; i++) {
      if (cur[i] === 1) glow[i] = GLOW
      else if (glow[i] > 0) glow[i]--
    }
    if (live < 14) calm++
    else calm = 0
    if (calm > 18) seed()
  }

  p.draw = () => {
    if (p.frameCount % 2 === 1) step()
    for (let i = 0; i < CELLS; i++) {
      const o = i * 4
      const s = cur[i]
      if (s === 1) {
        px[o] = hot[0]
        px[o + 1] = hot[1]
        px[o + 2] = hot[2]
      } else if (s === 2) {
        px[o] = dying[0]
        px[o + 1] = dying[1]
        px[o + 2] = dying[2]
      } else {
        const g = glow[i] * 3
        px[o] = restLut[g]
        px[o + 1] = restLut[g + 1]
        px[o + 2] = restLut[g + 2]
      }
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
