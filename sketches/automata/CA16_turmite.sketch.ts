import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 128
const CELLS = N * N
const AGENTS = 6
const STEPS = 44
const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]
const TURN = [1, -1, 1, -1, -1, 1, 2, 1]
const WRITE = [1, 2, 3, 0, 2, 0, 1, 3]
const NEXT = [0, 1, 0, 1, 1, 0, 1, 0]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  const grid = new Uint8Array(CELLS)
  const ax = new Int16Array(AGENTS)
  const ay = new Int16Array(AGENTS)
  const dir = new Uint8Array(AGENTS)
  const mode = new Uint8Array(AGENTS)
  const tone = new Uint8Array(12)

  const reset = () => {
    grid.fill(0)
    for (let k = 0; k < AGENTS; k++) {
      const a = (k / AGENTS) * p.TWO_PI
      ax[k] = (N >> 1) + Math.round(Math.cos(a) * 9)
      ay[k] = (N >> 1) + Math.round(Math.sin(a) * 9)
      dir[k] = p.random(4) | 0
      mode[k] = k & 1
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
    const colors = [p.color(pal.bg), p.color(pal.dim), p.color(pal.signal),
      p.lerpColor(p.color(pal.signal), p.color(pal.accent), 0.38)]
    for (let i = 0; i < colors.length; i++) {
      tone[i * 3] = p.red(colors[i])
      tone[i * 3 + 1] = p.green(colors[i])
      tone[i * 3 + 2] = p.blue(colors[i])
    }
    reset()
  }

  const march = () => {
    for (let s = 0; s < STEPS; s++) {
      for (let k = 0; k < AGENTS; k++) {
        const i = ay[k] * N + ax[k]
        const rule = mode[k] * 4 + grid[i]
        grid[i] = WRITE[rule]
        dir[k] = (dir[k] + TURN[rule] + 4) & 3
        mode[k] = NEXT[rule]
        ax[k] = (ax[k] + DX[dir[k]] + N) % N
        ay[k] = (ay[k] + DY[dir[k]] + N) % N
      }
    }
  }

  p.draw = () => {
    march()
    if (p.frameCount % 720 === 0) reset()
    for (let i = 0; i < CELLS; i++) {
      const s = grid[i] * 3
      const o = i * 4
      px[o] = tone[s]
      px[o + 1] = tone[s + 1]
      px[o + 2] = tone[s + 2]
    }
    const ac = p.color(pal.accent)
    for (let k = 0; k < AGENTS; k++) {
      const o = (ay[k] * N + ax[k]) * 4
      px[o] = p.red(ac)
      px[o + 1] = p.green(ac)
      px[o + 2] = p.blue(ac)
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
