import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 128
const CELLS = N * N
const DROP = 30
const SWEEPS = 18
const FLASH = 7

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  // Int32 so the drop cell can hold an undispersed backlog without wrapping
  const h = new Int32Array(CELLS)
  const fired = new Uint8Array(CELLS)
  const flash = new Uint8Array(CELLS)
  const heightLut = new Uint8Array(4 * 3)
  const hot = new Uint8Array(3)

  // one parallel toppling sweep: every cell at or above 4 sheds one grain to each
  // 4-neighbour at once (grains leaving the border fall off the table)
  const relax = () => {
    let any = 0
    for (let i = 0; i < CELLS; i++) {
      const f = h[i] >= 4 ? 1 : 0
      fired[i] = f
      any += f
    }
    if (any === 0) return
    for (let y = 0; y < N; y++) {
      const mid = y * N
      for (let x = 0; x < N; x++) {
        const i = mid + x
        let v = h[i] - (fired[i] === 1 ? 4 : 0)
        if (x > 0) v += fired[i - 1]
        if (x < N - 1) v += fired[i + 1]
        if (y > 0) v += fired[i - N]
        if (y < N - 1) v += fired[i + N]
        h[i] = v
        if (fired[i] === 1) flash[i] = FLASH
      }
    }
  }

  const spilled = () => {
    const last = (N - 1) * N
    for (let x = 0; x < N; x++) {
      if (h[x] > 0 || h[last + x] > 0) return true
      if (h[x * N] > 0 || h[x * N + N - 1] > 0) return true
    }
    return false
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
    const dm = p.color(pal.dim)
    const sg = p.color(pal.signal)
    const ac = p.color(pal.accent)
    const steps = [bgc, p.lerpColor(bgc, dm, 0.85), p.lerpColor(dm, sg, 0.45), sg]
    for (let i = 0; i < 4; i++) {
      const c = steps[i]
      heightLut[i * 3] = p.red(c)
      heightLut[i * 3 + 1] = p.green(c)
      heightLut[i * 3 + 2] = p.blue(c)
    }
    hot[0] = p.red(ac)
    hot[1] = p.green(ac)
    hot[2] = p.blue(ac)
  }

  p.draw = () => {
    h[(N >> 1) * N + (N >> 1)] += DROP
    for (let s = 0; s < SWEEPS; s++) relax()
    if (p.frameCount % 24 === 0 && spilled()) {
      h.fill(0)
      flash.fill(0)
    }

    for (let i = 0; i < CELLS; i++) {
      const s = (h[i] > 3 ? 3 : h[i]) * 3
      const o = i * 4
      const f = flash[i]
      if (f > 0) {
        const t = f / FLASH
        px[o] = heightLut[s] + (hot[0] - heightLut[s]) * t
        px[o + 1] = heightLut[s + 1] + (hot[1] - heightLut[s + 1]) * t
        px[o + 2] = heightLut[s + 2] + (hot[2] - heightLut[s + 2]) * t
        flash[i] = f - 1
      } else {
        px[o] = heightLut[s]
        px[o + 1] = heightLut[s + 1]
        px[o + 2] = heightLut[s + 2]
      }
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
