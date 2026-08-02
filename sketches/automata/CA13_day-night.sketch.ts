import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 112
const CELLS = N * N

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const changed = new Uint8Array(CELLS)
  const colors = new Uint8Array(12)
  let calm = 0

  const invertPatch = () => {
    const cx = 16 + (p.random(N - 32) | 0)
    const cy = 16 + (p.random(N - 32) | 0)
    for (let y = cy - 10; y <= cy + 10; y++) {
      for (let x = cx - 10; x <= cx + 10; x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 < 100) cur[y * N + x] ^= 1
      }
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
    const shades = [p.color(pal.ink), p.color(pal.signal), p.color(pal.dim), p.color(pal.accent)]
    for (let i = 0; i < shades.length; i++) {
      colors[i * 3] = p.red(shades[i])
      colors[i * 3 + 1] = p.green(shades[i])
      colors[i * 3 + 2] = p.blue(shades[i])
    }
    for (let i = 0; i < CELLS; i++) cur[i] = p.random() < 0.5 ? 1 : 0
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
        const on = cur[i] === 1 ? (n === 3 || n === 4 || n >= 6) : (n === 3 || n >= 6)
        nxt[i] = on ? 1 : 0
        changed[i] = nxt[i] === cur[i] ? 0 : 1
        moved += changed[i]
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    calm = moved < 20 ? calm + 1 : 0
    if (calm > 28 || p.frameCount % 180 === 0) invertPatch()
  }

  p.draw = () => {
    if (p.frameCount % 2 === 1) step()
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const i = y * N + x
        const edge = cur[i] !== cur[y * N + (x + 1) % N] || cur[i] !== cur[((y + 1) % N) * N + x]
        const s = (changed[i] === 1 ? 3 : edge ? 2 : cur[i]) * 3
        const o = i * 4
        px[o] = colors[s]
        px[o + 1] = colors[s + 1]
        px[o + 2] = colors[s + 2]
      }
    }
    changed.fill(0)
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
