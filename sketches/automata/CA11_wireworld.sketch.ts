import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 120
const CELLS = N * N

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const tone = new Uint8Array(12)

  const wire = (x0: number, y0: number, x1: number, y1: number) => {
    const dx = Math.sign(x1 - x0)
    const dy = Math.sign(y1 - y0)
    for (let x = x0; x !== x1 + dx; x += dx || 1) cur[y0 * N + x] = 1
    for (let y = y0; y !== y1 + dy; y += dy || 1) cur[y * N + x1] = 1
  }

  const pulse = (x: number, y: number) => {
    cur[y * N + x] = 3
    cur[y * N + x + 1] = 2
  }

  const buildCircuit = () => {
    cur.fill(0)
    for (let y = 14; y <= 104; y += 18) wire(8, y, 111, y)
    for (let x = 24; x <= 96; x += 24) {
      wire(x, 14, x, 104)
      wire(x + 4, 23, x + 4, 95)
    }
    wire(8, 14, 8, 104)
    wire(111, 14, 111, 104)
    for (let y = 14; y <= 104; y += 36) pulse(9, y)
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
    const conductor = p.lerpColor(p.color(pal.ink), p.color(pal.signal), 0.48)
    const colors = [bg, conductor, p.color(pal.accent), p.color(pal.signal)]
    for (let i = 0; i < colors.length; i++) {
      tone[i * 3] = p.red(colors[i])
      tone[i * 3 + 1] = p.green(colors[i])
      tone[i * 3 + 2] = p.blue(colors[i])
    }
    buildCircuit()
  }

  const step = () => {
    let heads = 0
    for (let y = 0; y < N; y++) {
      const up = (y === 0 ? N - 1 : y - 1) * N
      const dn = (y === N - 1 ? 0 : y + 1) * N
      const mid = y * N
      for (let x = 0; x < N; x++) {
        const i = mid + x
        const s = cur[i]
        if (s === 2) nxt[i] = 3
        else if (s === 3) nxt[i] = 1
        else if (s === 1) {
          const xl = x === 0 ? N - 1 : x - 1
          const xr = x === N - 1 ? 0 : x + 1
          const n =
            (cur[up + xl] === 2 ? 1 : 0) + (cur[up + x] === 2 ? 1 : 0) +
            (cur[up + xr] === 2 ? 1 : 0) + (cur[mid + xl] === 2 ? 1 : 0) +
            (cur[mid + xr] === 2 ? 1 : 0) + (cur[dn + xl] === 2 ? 1 : 0) +
            (cur[dn + x] === 2 ? 1 : 0) + (cur[dn + xr] === 2 ? 1 : 0)
          nxt[i] = n === 1 || n === 2 ? 2 : 1
        } else nxt[i] = 0
        if (nxt[i] === 2) heads++
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    if (heads === 0 || p.frameCount % 72 === 0) pulse(9, 14 + 18 * (p.random(6) | 0))
  }

  p.draw = () => {
    if (p.frameCount % 2 === 1) step()
    for (let i = 0; i < CELLS; i++) {
      const s = cur[i] * 3
      const o = i * 4
      px[o] = tone[s]
      px[o + 1] = tone[s + 1]
      px[o + 2] = tone[s + 2]
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
