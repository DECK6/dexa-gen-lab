import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 104
const CELLS = N * N
const ATTEMPTS = 9000

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  const spin = new Int8Array(CELLS)
  const flash = new Uint8Array(CELLS)
  const tone = new Uint8Array(9)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    buf = p.createGraphics(N, N)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels
    const colors = [p.color(pal.ink), p.color(pal.signal), p.color(pal.accent)]
    for (let i = 0; i < colors.length; i++) {
      tone[i * 3] = p.red(colors[i])
      tone[i * 3 + 1] = p.green(colors[i])
      tone[i * 3 + 2] = p.blue(colors[i])
    }
    for (let i = 0; i < CELLS; i++) spin[i] = p.random() < 0.5 ? -1 : 1
  }

  const metropolis = () => {
    const temperature = 2.8 + 1.8 * Math.sin(p.frameCount * 0.035)
    const field = 0.12 * Math.sin(p.frameCount * 0.011)
    for (let k = 0; k < ATTEMPTS; k++) {
      const i = p.random(CELLS) | 0
      const x = i % N
      const y = (i / N) | 0
      const left = y * N + (x === 0 ? N - 1 : x - 1)
      const right = y * N + (x === N - 1 ? 0 : x + 1)
      const up = (y === 0 ? N - 1 : y - 1) * N + x
      const down = (y === N - 1 ? 0 : y + 1) * N + x
      const energy = 2 * spin[i] * (spin[left] + spin[right] + spin[up] + spin[down] + field)
      if (energy <= 0 || p.random() < Math.exp(-energy / temperature)) {
        spin[i] = -spin[i]
        if ((k & 7) === 0) flash[i] = 2
      }
    }
  }

  p.draw = () => {
    metropolis()
    for (let i = 0; i < CELLS; i++) {
      const s = (flash[i] > 0 ? 2 : spin[i] > 0 ? 1 : 0) * 3
      const o = i * 4
      px[o] = tone[s]
      px[o + 1] = tone[s + 1]
      px[o + 2] = tone[s + 2]
      if (flash[i] > 0) flash[i]--
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
