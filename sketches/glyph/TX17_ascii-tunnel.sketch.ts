import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const RAMP = ' .:-=+*#%@'
const DEPTH = 18
const STEPS = 13

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    p.noStroke()
  }

  p.draw = () => {
    p.background(pal.bg)
    const f = p.frameCount
    const cx = p.width * 0.5 + Math.sin(f * 0.011) * p.width * 0.045
    const cy = p.height * 0.5 + Math.cos(f * 0.009) * p.height * 0.035

    for (let ring = 0; ring < DEPTH; ring++) {
      const z = (ring / DEPTH + f * 0.006) % 1
      const depth = z * z
      const size = p.lerp(p.width * 0.035, p.width * 0.74, depth)
      const half = size * 0.5
      const c = p.color(z > 0.82 && ring % 4 === 0 ? pal.accent : pal.signal)
      c.setAlpha(32 + z * 215)
      p.fill(c)
      p.textSize(p.width * (0.011 + z * 0.027))
      const glyph = RAMP.charAt(Math.min(RAMP.length - 1, Math.floor(z * RAMP.length)))

      for (let step = 0; step < STEPS; step++) {
        const u = (step + 0.5) / STEPS
        const d = p.lerp(-half, half, u)
        p.text(glyph, cx + d, cy - half)
        p.text(glyph, cx + half, cy + d)
        p.text(glyph, cx - d, cy + half)
        p.text(glyph, cx - half, cy - d)
      }

      if (ring % 4 === 0) {
        const guide = p.color(pal.dim)
        guide.setAlpha(35 + z * 45)
        p.noFill()
        p.stroke(guide)
        p.rect(cx - half, cy - half, size, size)
        p.noStroke()
      }
    }

    const reticle = p.color(pal.accent)
    reticle.setAlpha(190)
    p.fill(reticle)
    p.rect(cx - p.width * 0.025, cy, p.width * 0.05, 1)
    p.rect(cx, cy - p.height * 0.025, 1, p.height * 0.05)
  }
}
