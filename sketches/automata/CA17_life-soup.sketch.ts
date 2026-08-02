import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 112
const CELLS = N * N
const GLOW = 7

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let cur = new Uint8Array(CELLS)
  let nxt = new Uint8Array(CELLS)
  const mark = new Uint8Array(CELLS)
  const glow = new Uint8Array(CELLS)
  const glider = new Uint8Array(512)
  const tone = new Uint8Array(15)

  const transform = (mask: number, turns: number, mirror: boolean) => {
    let out = 0
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
      if ((mask & (1 << (y * 3 + x))) === 0) continue
      let xx = mirror ? 2 - x : x
      let yy = y
      for (let t = 0; t < turns; t++) [xx, yy] = [2 - yy, xx]
      out |= 1 << (yy * 3 + xx)
    }
    return out
  }

  const plant = (amount: number) => {
    for (let k = 0; k < amount; k++) {
      const x0 = 3 + (p.random(N - 6) | 0)
      const y0 = 3 + (p.random(N - 6) | 0)
      const mask = transform(482, p.random(4) | 0, p.random() < 0.5)
      for (let y = -1; y < 4; y++) for (let x = -1; x < 4; x++) cur[(y0 + y) * N + x0 + x] = 0
      for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
        if ((mask & (1 << (y * 3 + x))) !== 0) cur[(y0 + y) * N + x0 + x] = 1
      }
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
    for (const base of [482, 181, 428, 241]) {
      for (let r = 0; r < 4; r++) {
        glider[transform(base, r, false)] = 1
        glider[transform(base, r, true)] = 1
      }
    }
    const colors = [p.color(pal.bg), p.color(pal.signal), p.color(pal.paper),
      p.color(pal.accent), p.lerpColor(p.color(pal.bg), p.color(pal.dim), 0.72)]
    for (let i = 0; i < colors.length; i++) {
      tone[i * 3] = p.red(colors[i])
      tone[i * 3 + 1] = p.green(colors[i])
      tone[i * 3 + 2] = p.blue(colors[i])
    }
    for (let i = 0; i < CELLS; i++) cur[i] = p.random() < 0.2 ? 1 : 0
    plant(14)
  }

  const step = () => {
    let live = 0
    for (let y = 0; y < N; y++) {
      const up = (y === 0 ? N - 1 : y - 1) * N
      const dn = (y === N - 1 ? 0 : y + 1) * N
      for (let x = 0; x < N; x++) {
        const xl = x === 0 ? N - 1 : x - 1
        const xr = x === N - 1 ? 0 : x + 1
        const i = y * N + x
        const n = cur[up + xl] + cur[up + x] + cur[up + xr] + cur[y * N + xl] +
          cur[y * N + xr] + cur[dn + xl] + cur[dn + x] + cur[dn + xr]
        nxt[i] = n === 3 || (cur[i] === 1 && n === 2) ? 1 : 0
        live += nxt[i]
      }
    }
    const swap = cur
    cur = nxt
    nxt = swap
    mark.fill(0)
    for (let y = 1; y < N - 2; y++) for (let x = 1; x < N - 2; x++) {
      let mask = 0
      for (let yy = 0; yy < 3; yy++) for (let xx = 0; xx < 3; xx++) mask |= cur[(y + yy) * N + x + xx] << (yy * 3 + xx)
      if (glider[mask] === 1) for (let yy = 0; yy < 3; yy++) for (let xx = 0; xx < 3; xx++) {
        if (cur[(y + yy) * N + x + xx] === 1) mark[(y + yy) * N + x + xx] = 3
      }
      const i = (y + 1) * N + x + 1
      if ((cur[i - 1] === 1 && cur[i + 1] === 1) || (cur[i - N] === 1 && cur[i + N] === 1)) mark[i] = 2
    }
    if (live < 90 || p.frameCount % 280 === 0) plant(live < 90 ? 12 : 3)
  }

  p.draw = () => {
    if (p.frameCount % 2 === 1) step()
    for (let i = 0; i < CELLS; i++) {
      if (cur[i] === 1) glow[i] = GLOW
      else if (glow[i] > 0) glow[i]--
      const s = (mark[i] || (cur[i] === 1 ? 1 : glow[i] > 0 ? 4 : 0)) * 3
      const o = i * 4
      px[o] = tone[s]
      px[o + 1] = tone[s + 1]
      px[o + 2] = tone[s + 2]
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
