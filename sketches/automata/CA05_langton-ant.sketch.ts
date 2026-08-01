import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 128
const CELLS = N * N
const ANTS = 5
const STEPS = 42
const HEAT = 14
const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  const grid = new Uint8Array(CELLS)
  const heat = new Uint8Array(CELLS)
  const ax = new Int16Array(ANTS)
  const ay = new Int16Array(ANTS)
  const ad = new Uint8Array(ANTS)
  const onLut = new Uint8Array((HEAT + 1) * 3)
  const offLut = new Uint8Array((HEAT + 1) * 3)

  const placeAnts = () => {
    for (let k = 0; k < ANTS; k++) {
      ax[k] = 24 + (p.random(N - 48) | 0)
      ay[k] = 24 + (p.random(N - 48) | 0)
      ad[k] = p.random(4) | 0
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

    const bgc = p.color(pal.bg)
    const ink = p.color(pal.ink)
    const sg = p.color(pal.signal)
    const ac = p.color(pal.accent)
    const trail = p.lerpColor(ink, sg, 0.62)
    for (let i = 0; i <= HEAT; i++) {
      const t = i / HEAT
      const on = p.lerpColor(trail, ac, t)
      const off = p.lerpColor(bgc, ac, t * 0.8)
      onLut[i * 3] = p.red(on)
      onLut[i * 3 + 1] = p.green(on)
      onLut[i * 3 + 2] = p.blue(on)
      offLut[i * 3] = p.red(off)
      offLut[i * 3 + 1] = p.green(off)
      offLut[i * 3 + 2] = p.blue(off)
    }
    placeAnts()
  }

  // classic LR rule on a torus: turn right on an unset cell, left on a set one, flip, advance
  const march = () => {
    for (let s = 0; s < STEPS; s++) {
      for (let k = 0; k < ANTS; k++) {
        const i = ay[k] * N + ax[k]
        if (grid[i] === 1) {
          ad[k] = (ad[k] + 3) & 3
          grid[i] = 0
        } else {
          ad[k] = (ad[k] + 1) & 3
          grid[i] = 1
        }
        heat[i] = HEAT
        ax[k] = (ax[k] + DX[ad[k]] + N) % N
        ay[k] = (ay[k] + DY[ad[k]] + N) % N
      }
    }
  }

  p.draw = () => {
    march()
    let on = 0
    for (let i = 0; i < CELLS; i++) {
      const set = grid[i] === 1
      if (set) on++
      const lut = set ? onLut : offLut
      const s = heat[i] * 3
      const o = i * 4
      px[o] = lut[s]
      px[o + 1] = lut[s + 1]
      px[o + 2] = lut[s + 2]
      if (heat[i] > 0) heat[i]--
    }
    // once the torus is saturated the highways drown in noise — wipe and re-release
    if (on > CELLS * 0.58) {
      grid.fill(0)
      heat.fill(0)
      placeAnts()
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
