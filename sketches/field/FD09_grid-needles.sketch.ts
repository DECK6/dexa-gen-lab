import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const G = 20 // needles per side
const SWEEP = 1.5 // scan-line px per frame
const LIT = 52 // scan halo radius

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    p.strokeCap(p.SQUARE)
  }

  p.draw = () => {
    p.background(pal.bg)

    const cs = p.width / G
    const rs = p.height / G
    const z = p.frameCount * 0.0022
    const scan = ((p.frameCount * SWEEP) % (p.width + 2 * LIT)) - LIT

    const dim = p.color(pal.dim)
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)

    // Bezel: registration ticks around the readout area.
    dim.setAlpha(120)
    p.stroke(dim)
    p.strokeWeight(1)
    for (let i = 0; i <= G; i += 2) {
      const x = i * cs
      const y = i * rs
      p.line(x, 0, x, 6)
      p.line(x, p.height, x, p.height - 6)
      p.line(0, y, 6, y)
      p.line(p.width, y, p.width - 6, y)
    }

    orange.setAlpha(80)
    p.stroke(orange)
    p.line(scan, 0, scan, p.height)

    for (let j = 0; j < G; j++) {
      const cyp = (j + 0.5) * rs
      for (let i = 0; i < G; i++) {
        const cxp = (i + 0.5) * cs
        const ang = p.noise(i * 0.17, j * 0.17, z) * p.TWO_PI * 2
        const mag = p.noise(i * 0.17 + 60, j * 0.17 + 60, z * 1.5)
        const lit = Math.max(0, 1 - Math.abs(cxp - scan) / LIT)
        const len = cs * (0.2 + mag * 0.42)
        const dx = Math.cos(ang)
        const dy = Math.sin(ang)

        dim.setAlpha(130)
        p.stroke(dim)
        p.strokeWeight(1)
        p.line(cxp - dx * len * 0.34, cyp - dy * len * 0.34, cxp, cyp)

        const strong = mag > 0.74
        cyan.setAlpha(72 + mag * 110 + lit * 70)
        p.stroke(cyan)
        p.strokeWeight(1.1 + lit * 1.1)
        p.line(cxp, cyp, cxp + dx * len, cyp + dy * len)

        const tip = strong || lit > 0.45 ? orange : cyan
        tip.setAlpha(85 + mag * 60 + lit * 145)
        p.noStroke()
        p.fill(tip)
        p.circle(cxp + dx * len, cyp + dy * len, 1.8 + lit * 2.4 + (strong ? 1.4 : 0))
      }
    }
  }
}
