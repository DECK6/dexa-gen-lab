import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 128
const CELLS = N * N
const HALF = N >> 1
const WALKERS = 320
const STEPS = 3
const LUT_N = 32
const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  const grid = new Uint8Array(CELLS)
  const stamp = new Uint16Array(CELLS)
  const wx = new Int16Array(WALKERS)
  const wy = new Int16Array(WALKERS)
  const lut = new Uint8Array(LUT_N * 3)
  const bgc = new Uint8Array(3)
  const gas = new Uint8Array(3)
  let tick = 0
  let radius = 1

  const spawn = (k: number) => {
    const r = Math.min(radius + 8, HALF - 2)
    const a = p.random(p.TWO_PI)
    wx[k] = HALF + Math.round(Math.cos(a) * r)
    wy[k] = HALF + Math.round(Math.sin(a) * r)
  }

  const restart = () => {
    grid.fill(0)
    stamp.fill(0)
    grid[HALF * N + HALF] = 1
    stamp[HALF * N + HALF] = tick
    radius = 1
    for (let k = 0; k < WALKERS; k++) spawn(k)
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

    const bg = p.color(pal.bg)
    const sg = p.color(pal.signal)
    const ac = p.color(pal.accent)
    const dm = p.color(pal.dim)
    for (let i = 0; i < LUT_N; i++) {
      const c = i < 3 ? p.lerpColor(ac, sg, i / 3) : p.lerpColor(sg, dm, (i - 3) / (LUT_N - 4))
      lut[i * 3] = p.red(c)
      lut[i * 3 + 1] = p.green(c)
      lut[i * 3 + 2] = p.blue(c)
    }
    bgc[0] = p.red(bg)
    bgc[1] = p.green(bg)
    bgc[2] = p.blue(bg)
    const gc = p.lerpColor(bg, dm, 0.55)
    gas[0] = p.red(gc)
    gas[1] = p.green(gc)
    gas[2] = p.blue(gc)
    restart()
  }

  const stick = (k: number, i: number, x: number, y: number) => {
    grid[i] = 1
    stamp[i] = tick
    const dx = x - HALF
    const dy = y - HALF
    const r = Math.sqrt(dx * dx + dy * dy)
    if (r > radius) radius = r
    spawn(k)
  }

  // random walkers freeze on contact with the aggregate — diffusion-limited aggregation
  const diffuse = () => {
    const kill = Math.min(radius * 1.8 + 16, HALF - 1)
    for (let k = 0; k < WALKERS; k++) {
      for (let s = 0; s < STEPS; s++) {
        const d = p.random(4) | 0
        const x = wx[k] + DX[d]
        const y = wy[k] + DY[d]
        const dx = x - HALF
        const dy = y - HALF
        if (x < 1 || x > N - 2 || y < 1 || y > N - 2 || dx * dx + dy * dy > kill * kill) {
          spawn(k)
          break
        }
        wx[k] = x
        wy[k] = y
        const i = y * N + x
        if (grid[i - 1] === 1 || grid[i + 1] === 1 || grid[i - N] === 1 || grid[i + N] === 1) {
          stick(k, i, x, y)
          break
        }
      }
    }
  }

  p.draw = () => {
    tick = (tick + 1) & 0xffff
    diffuse()
    if (radius > HALF - 6) restart()

    for (let i = 0; i < CELLS; i++) {
      const o = i * 4
      if (grid[i] === 1) {
        let a = ((tick - stamp[i]) & 0xffff) >> 2
        if (a > LUT_N - 1) a = LUT_N - 1
        const s = a * 3
        px[o] = lut[s]
        px[o + 1] = lut[s + 1]
        px[o + 2] = lut[s + 2]
      } else {
        px[o] = bgc[0]
        px[o + 1] = bgc[1]
        px[o + 2] = bgc[2]
      }
    }
    for (let k = 0; k < WALKERS; k++) {
      const o = (wy[k] * N + wx[k]) * 4
      px[o] = gas[0]
      px[o + 1] = gas[1]
      px[o + 2] = gas[2]
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
