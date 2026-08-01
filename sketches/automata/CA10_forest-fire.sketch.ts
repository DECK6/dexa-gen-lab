import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 128
const CELLS = N * N
const GROW = 0.008
const LIGHTNING = 0.00001
const AGE_MAX = 15
const ASH_MAX = 10

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const age = new Uint8Array(CELLS)
  const ash = new Uint8Array(CELLS)
  const treeLut = new Uint8Array((AGE_MAX + 1) * 3)
  const ashLut = new Uint8Array((ASH_MAX + 1) * 3)
  const hot = new Uint8Array(3)

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
    const sg = p.color(pal.signal)
    const ac = p.color(pal.accent)
    for (let i = 0; i <= AGE_MAX; i++) {
      const c = p.lerpColor(ink, sg, 0.22 + 0.78 * (i / AGE_MAX))
      treeLut[i * 3] = p.red(c)
      treeLut[i * 3 + 1] = p.green(c)
      treeLut[i * 3 + 2] = p.blue(c)
    }
    for (let i = 0; i <= ASH_MAX; i++) {
      const c = p.lerpColor(bgc, ac, (i / ASH_MAX) * 0.42)
      ashLut[i * 3] = p.red(c)
      ashLut[i * 3 + 1] = p.green(c)
      ashLut[i * 3 + 2] = p.blue(c)
    }
    hot[0] = p.red(ac)
    hot[1] = p.green(ac)
    hot[2] = p.blue(ac)

    for (let i = 0; i < CELLS; i++) {
      cur[i] = p.random() < 0.4 ? 1 : 0
      age[i] = p.random(AGE_MAX) | 0
    }
  }

  // Drossel-Schwabl: burning -> empty, tree catches from a burning 4-neighbour or lightning,
  // empty regrows. Growth and strikes are sampled as event counts instead of per-cell rolls.
  const step = () => {
    for (let y = 0; y < N; y++) {
      const up = (y === 0 ? N - 1 : y - 1) * N
      const dn = (y === N - 1 ? 0 : y + 1) * N
      const mid = y * N
      for (let x = 0; x < N; x++) {
        const i = mid + x
        const s = cur[i]
        if (s === 2) {
          nxt[i] = 0
          ash[i] = ASH_MAX
          age[i] = 0
          continue
        }
        if (s === 0) {
          nxt[i] = 0
          continue
        }
        const xl = x === 0 ? N - 1 : x - 1
        const xr = x === N - 1 ? 0 : x + 1
        if (cur[mid + xl] === 2 || cur[mid + xr] === 2 || cur[up + x] === 2 || cur[dn + x] === 2) {
          nxt[i] = 2
        } else {
          nxt[i] = 1
          if (age[i] < AGE_MAX) age[i]++
        }
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap

    const grow = (GROW * CELLS) | 0
    for (let k = 0; k < grow; k++) {
      const i = p.random(CELLS) | 0
      if (cur[i] === 0) {
        cur[i] = 1
        age[i] = 0
      }
    }
    if (p.random() < LIGHTNING * CELLS) {
      const i = p.random(CELLS) | 0
      if (cur[i] === 1) cur[i] = 2
    }
  }

  p.draw = () => {
    step()
    for (let i = 0; i < CELLS; i++) {
      const o = i * 4
      const s = cur[i]
      if (s === 2) {
        px[o] = hot[0]
        px[o + 1] = hot[1]
        px[o + 2] = hot[2]
      } else if (s === 1) {
        const t = age[i] * 3
        px[o] = treeLut[t]
        px[o + 1] = treeLut[t + 1]
        px[o + 2] = treeLut[t + 2]
      } else {
        const t = ash[i] * 3
        px[o] = ashLut[t]
        px[o + 1] = ashLut[t + 1]
        px[o + 2] = ashLut[t + 2]
        if (ash[i] > 0) ash[i]--
      }
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
