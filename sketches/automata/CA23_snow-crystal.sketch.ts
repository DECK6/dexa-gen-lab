import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const R = 50
const N = R * 2 + 1
const CELLS = N * N
const B = 144
const DQ = [1, 0, -1, -1, 0, 1]
const DR = [0, 1, 1, 0, -1, -1]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const age = new Uint8Array(CELLS)
  const tone = new Uint8Array(12)
  let radius = 0

  const valid = (q: number, r: number) => Math.abs(q) <= R && Math.abs(r) <= R && Math.abs(q + r) <= R

  const symmetricNoise = (q: number, r: number) => {
    let cq = q
    let cr = r
    let best = Infinity
    let bq = q
    let br = r
    for (let k = 0; k < 6; k++) {
      const key = (cq + R) * N + cr + R
      if (key < best) {
        best = key
        bq = cq
        br = cr
      }
      ;[cq, cr] = [-cr, cq + cr]
    }
    return p.noise((bq + R) * 0.085, (br + R) * 0.085)
  }

  const reset = () => {
    cur.fill(0)
    nxt.fill(0)
    age.fill(0)
    cur[R * N + R] = 1
    radius = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    buf = p.createGraphics(B, B)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels
    const colors = [p.color(pal.bg), p.color(pal.signal), p.color(pal.accent), p.color(pal.dim)]
    for (let i = 0; i < colors.length; i++) {
      tone[i * 3] = p.red(colors[i])
      tone[i * 3 + 1] = p.green(colors[i])
      tone[i * 3 + 2] = p.blue(colors[i])
    }
    reset()
  }

  const grow = () => {
    let added = 0
    let edge = radius
    for (let r = -R; r <= R; r++) for (let q = -R; q <= R; q++) {
      if (!valid(q, r)) continue
      const i = (r + R) * N + q + R
      if (cur[i] === 1) {
        nxt[i] = 1
        age[i] = Math.min(255, age[i] + 1)
        continue
      }
      let neighbours = 0
      for (let d = 0; d < 6; d++) {
        const qq = q + DQ[d]
        const rr = r + DR[d]
        if (valid(qq, rr)) neighbours += cur[(rr + R) * N + qq + R]
      }
      const ring = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r))
      const branch = symmetricNoise(q, r) > 0.49 + 0.09 * Math.sin(ring * 0.56)
      nxt[i] = neighbours > 0 && (ring < 5 || neighbours >= 2 || branch) ? 1 : 0
      if (nxt[i] === 1) {
        added++
        age[i] = 0
        edge = Math.max(edge, ring)
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    radius = edge
    if (added === 0 || radius >= R - 1) reset()
  }

  p.draw = () => {
    if (p.frameCount % 2 === 1) grow()
    for (let i = 0; i < B * B; i++) {
      const o = i * 4
      px[o] = tone[0]
      px[o + 1] = tone[1]
      px[o + 2] = tone[2]
    }
    for (let r = -R; r <= R; r++) for (let q = -R; q <= R; q++) if (valid(q, r)) {
      const i = (r + R) * N + q + R
      if (cur[i] === 0) continue
      const x = Math.round(B / 2 + (q + r * 0.5) * 1.2)
      const y = Math.round(B / 2 + r * 1.04)
      const s = (age[i] < 3 ? 2 : age[i] > 35 ? 3 : 1) * 3
      for (let yy = y; yy <= y + 1; yy++) for (let xx = x; xx <= x + 1; xx++) {
        const o = (yy * B + xx) * 4
        px[o] = tone[s]
        px[o + 1] = tone[s + 1]
        px[o + 2] = tone[s + 2]
      }
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
