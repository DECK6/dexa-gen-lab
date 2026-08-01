import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 1400
const ECC = 0.3 // orbital flattening that turns aligned ellipses into arms
const WIND = 2.15 // arm winding, in turns from core to rim
const PATTERN = 0.0058 // density-wave precession per frame

interface Star {
  r: number
  th: number
  w: number
  tilt: number
  a: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const stars: Star[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    const rMax = p.width * 0.44
    for (let i = 0; i < N; i++) {
      const u = Math.pow(p.random(), 0.62)
      const r = rMax * u + p.random(-4, 4)
      stars.push({
        r,
        th: p.random(p.TWO_PI),
        w: 0.021 / (0.3 + 1.6 * u),
        tilt: u * WIND * p.TWO_PI + p.random(-0.05, 0.05),
        a: 60 + (1 - u) * 150,
        hot: p.random() < 0.02,
      })
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(24)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const f = p.frameCount
    const cx = p.width / 2
    const cy = p.height / 2
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)

    for (let i = 0; i < N; i++) {
      const s = stars[i]
      const th = s.th + s.w * f
      const lx = s.r * Math.cos(th)
      const ly = s.r * (1 - ECC) * Math.sin(th)
      const ph = s.tilt + PATTERN * f
      const cs = Math.cos(ph)
      const sn = Math.sin(ph)
      const x = cx + lx * cs - ly * sn
      const y = cy + lx * sn + ly * cs
      if (s.hot) {
        orange.setAlpha(s.a)
        p.fill(orange)
        p.ellipse(x, y, 2.4)
      } else {
        cyan.setAlpha(s.a)
        p.fill(cyan)
        p.ellipse(x, y, 1.6)
      }
    }

    const core = p.color(pal.paper)
    core.setAlpha(26)
    p.fill(core)
    p.ellipse(cx, cy, p.width * 0.075)
    core.setAlpha(60)
    p.fill(core)
    p.ellipse(cx, cy, p.width * 0.03)

    const halo = p.color(pal.accent)
    halo.setAlpha(70)
    p.noFill()
    p.stroke(halo)
    p.strokeWeight(1)
    p.ellipse(cx, cy, p.width * (0.12 + 0.008 * Math.sin(f * 0.03)))
  }
}
