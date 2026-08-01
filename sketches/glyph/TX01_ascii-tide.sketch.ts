import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

// density ramp: sparse -> dense
const RAMP = ' .:-=+*#%@'
const COLS = 46

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let cw = 0
  let ch = 0
  let rows = 0
  let drift = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    cw = p.width / COLS
    ch = cw * 1.62
    rows = Math.ceil(p.height / ch)
    drift = p.random(100)
    p.textFont('JetBrains Mono, monospace')
    p.textSize(cw * 1.5)
    p.textAlign(p.CENTER, p.CENTER)
    p.noStroke()
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.011
    const hot = p.color(pal.accent)
    const cool = p.color(pal.signal)

    for (let gy = 0; gy < rows; gy++) {
      // tide swells vertically, ramp drifts sideways
      const swell = 0.5 + 0.5 * Math.sin(gy * 0.21 - t * 1.6)
      for (let gx = 0; gx < COLS; gx++) {
        const n = p.noise(gx * 0.085 + t * 0.6 + drift, gy * 0.12, t * 0.32)
        const d = p.constrain(n * 0.8 + swell * 0.42 - 0.24, 0, 0.999)
        const idx = Math.floor(d * RAMP.length)
        if (idx === 0) continue
        const c = idx >= RAMP.length - 1 ? hot : cool
        c.setAlpha(50 + d * 200)
        p.fill(c)
        p.text(RAMP.charAt(idx), (gx + 0.5) * cw, (gy + 0.5) * ch)
      }
    }
  }
}
