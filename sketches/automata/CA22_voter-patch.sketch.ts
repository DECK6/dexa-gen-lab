import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 104
const CELLS = N * N
const CENTERS = 18
const UPDATES = 3800
const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  const state = new Uint8Array(CELLS)
  const heat = new Uint8Array(CELLS)
  const tone = new Uint8Array(15)

  const seedPatches = () => {
    const cx = new Uint8Array(CENTERS)
    const cy = new Uint8Array(CENTERS)
    for (let k = 0; k < CENTERS; k++) {
      cx[k] = p.random(N) | 0
      cy[k] = p.random(N) | 0
    }
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      let best = 0
      let distance = Infinity
      for (let k = 0; k < CENTERS; k++) {
        const d = (x - cx[k]) ** 2 + (y - cy[k]) ** 2
        if (d < distance) {
          distance = d
          best = k
        }
      }
      state[y * N + x] = best % 3
    }
    heat.fill(0)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    buf = p.createGraphics(N, N)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels
    const colors = [p.color(pal.ink), p.lerpColor(p.color(pal.ink), p.color(pal.signal), 0.58),
      p.lerpColor(p.color(pal.signal), p.color(pal.paper), 0.32), p.color(pal.signal), p.color(pal.accent)]
    for (let i = 0; i < colors.length; i++) {
      tone[i * 3] = p.red(colors[i])
      tone[i * 3 + 1] = p.green(colors[i])
      tone[i * 3 + 2] = p.blue(colors[i])
    }
    seedPatches()
  }

  const vote = () => {
    for (let k = 0; k < UPDATES; k++) {
      const i = p.random(CELLS) | 0
      const x = i % N
      const y = (i / N) | 0
      const d = p.random(4) | 0
      const j = ((y + DY[d] + N) % N) * N + (x + DX[d] + N) % N
      if (state[i] !== state[j]) {
        state[i] = state[j]
        heat[i] = 5
      }
    }
  }

  p.draw = () => {
    vote()
    const count = [0, 0, 0]
    for (let i = 0; i < CELLS; i++) count[state[i]]++
    if (Math.max(...count) > CELLS * 0.94 || p.frameCount % 900 === 0) seedPatches()
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = y * N + x
      const edge = state[i] !== state[y * N + (x + 1) % N] || state[i] !== state[((y + 1) % N) * N + x]
      const s = (heat[i] > 0 ? 4 : edge ? 3 : state[i]) * 3
      const o = i * 4
      px[o] = tone[s]
      px[o + 1] = tone[s + 1]
      px[o + 2] = tone[s + 2]
      if (heat[i] > 0) heat[i]--
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
