import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MODULES = 380
const DIGITS = '0123456789'

interface Bar {
  x: number
  w: number
  h: number
  guard: boolean
  d: string
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const bars: Bar[] = []
  let total = 0
  let baseY = 0
  let unit = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    unit = p.width / 150
    baseY = p.height * 0.72
    p.textFont('JetBrains Mono, monospace')
    p.textSize(unit * 2.6)
    p.textAlign(p.CENTER, p.TOP)
    p.noStroke()

    let x = 0
    for (let i = 0; i < MODULES; i++) {
      // width follows a repeating rhythm, thickened by a slow noise swell
      const beat = 1 + (i % 7 === 0 ? 2 : i % 3 === 0 ? 1 : 0)
      const w = unit * (beat + Math.floor(p.noise(i * 0.21) * 2.4))
      const guard = i % 34 === 0
      const h = guard ? p.height * 0.56 : p.height * 0.3 * (0.55 + 0.45 * Math.abs(Math.sin(i * 0.37)))
      bars.push({ x, w, h, guard, d: DIGITS.charAt(Math.floor(p.random(10))) })
      x += w * 2
      total = x
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const scan = (p.frameCount * 3.1) % p.width
    const offset = (p.frameCount * 0.9) % total
    const ink = p.color(pal.signal)
    const hot = p.color(pal.accent)
    const label = p.color(pal.dim)

    for (let pass = 0; pass < 2; pass++) {
      const shift = pass * total
      for (let i = 0; i < bars.length; i++) {
        const b = bars[i]!
        const x = b.x - offset + shift
        if (x < -unit * 8 || x > p.width) continue
        const near = 1 - p.constrain(Math.abs(x + b.w * 0.5 - scan) / (unit * 10), 0, 1)
        const c = b.guard || near > 0.55 ? hot : ink
        c.setAlpha(110 + 145 * near + (b.guard ? 40 : 0))
        p.fill(c)
        p.rect(x, baseY - b.h, b.w, b.h)
        if (i % 4 === 0) {
          label.setAlpha(80 + 120 * near)
          p.fill(label)
          p.text(b.d, x + b.w * 0.5, baseY + unit * 1.2)
        }
      }
    }

    // scan head
    const beam = p.color(pal.accent)
    beam.setAlpha(150)
    p.fill(beam)
    p.rect(scan, p.height * 0.08, 1.5, p.height * 0.78)
    beam.setAlpha(28)
    p.fill(beam)
    p.rect(scan - unit * 5, p.height * 0.08, unit * 10, p.height * 0.78)

    // quiet-zone rules
    const rule = p.color(pal.dim)
    rule.setAlpha(70)
    p.fill(rule)
    p.rect(0, baseY + unit * 0.4, p.width, 1)
    p.rect(0, p.height * 0.08, p.width, 1)
  }
}
