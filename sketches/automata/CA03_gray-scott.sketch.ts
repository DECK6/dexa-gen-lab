import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const M = 160
const CELLS = M * M
const DA = 1.0
const DB = 0.5
const LUT_N = 96

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  let a = new Float32Array(CELLS)
  let b = new Float32Array(CELLS)
  let a2 = new Float32Array(CELLS)
  let b2 = new Float32Array(CELLS)
  const lut = new Uint8Array(LUT_N * 3)

  const blob = (cx: number, cy: number, r: number) => {
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        if (x * x + y * y > r * r) continue
        const i = ((((cy + y) % M) + M) % M) * M + ((((cx + x) % M) + M) % M)
        a[i] = 0.32
        b[i] = 0.62
      }
    }
  }

  const reseed = () => {
    a.fill(1)
    b.fill(0)
    const n = 5 + (p.random(4) | 0)
    for (let k = 0; k < n; k++) blob(p.random(M) | 0, p.random(M) | 0, 4 + (p.random(5) | 0))
  }

  // one explicit Euler step of Gray-Scott with a 9-point Laplacian (dt = 1, stable for DA/DB below)
  const step = (f: number, k: number) => {
    for (let y = 0; y < M; y++) {
      const up = (y === 0 ? M - 1 : y - 1) * M
      const dn = (y === M - 1 ? 0 : y + 1) * M
      const mid = y * M
      for (let x = 0; x < M; x++) {
        const xl = x === 0 ? M - 1 : x - 1
        const xr = x === M - 1 ? 0 : x + 1
        const i = mid + x
        const av = a[i]
        const bv = b[i]
        const la =
          (a[mid + xl] + a[mid + xr] + a[up + x] + a[dn + x]) * 0.2 +
          (a[up + xl] + a[up + xr] + a[dn + xl] + a[dn + xr]) * 0.05 - av
        const lb =
          (b[mid + xl] + b[mid + xr] + b[up + x] + b[dn + x]) * 0.2 +
          (b[up + xl] + b[up + xr] + b[dn + xl] + b[dn + xr]) * 0.05 - bv
        const r = av * bv * bv
        const na = av + DA * la - r + f * (1 - av)
        const nb = bv + DB * lb + r - (k + f) * bv
        a2[i] = na < 0 ? 0 : na > 1 ? 1 : na
        b2[i] = nb < 0 ? 0 : nb > 1 ? 1 : nb
      }
    }
    const ta = a
    a = a2
    a2 = ta
    const tb = b
    b = b2
    b2 = tb
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    p.background(pal.bg)
    buf = p.createGraphics(M, M)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels

    const bgc = p.color(pal.bg)
    const sg = p.color(pal.signal)
    const ac = p.color(pal.accent)
    for (let i = 0; i < LUT_N; i++) {
      const t = i / (LUT_N - 1)
      const c = t < 0.62 ? p.lerpColor(bgc, sg, t / 0.62) : p.lerpColor(sg, ac, (t - 0.62) / 0.38)
      lut[i * 3] = p.red(c)
      lut[i * 3 + 1] = p.green(c)
      lut[i * 3 + 2] = p.blue(c)
    }
    reseed()
  }

  p.draw = () => {
    // drift the feed/kill pair through the live region of the Gray-Scott diagram
    const t = p.frameCount * 0.0011
    const f = 0.03 + p.noise(t, 19.7) * 0.026
    const k = 0.0565 + p.noise(t, 71.3) * 0.0105
    step(f, k)
    step(f, k)

    if (p.frameCount % 45 === 0) {
      let sum = 0
      for (let i = 0; i < CELLS; i += 7) sum += b[i]
      if (sum / (CELLS / 7) < 0.008) reseed()
      else if (p.frameCount % 540 === 0) blob(p.random(M) | 0, p.random(M) | 0, 5)
    }

    for (let i = 0; i < CELLS; i++) {
      let t2 = b[i] * 3.2
      if (t2 > 1) t2 = 1
      const s = ((t2 * (LUT_N - 1)) | 0) * 3
      const o = i * 4
      px[o] = lut[s]
      px[o + 1] = lut[s + 1]
      px[o + 2] = lut[s + 2]
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
