import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 7

interface Reel {
  pos: number
  base: number
  ph: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const reels: Reel[] = []
  let margin = 0
  let colW = 0
  let dh = 0
  let rows = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    margin = p.width * 0.07
    colW = (p.width - margin * 2) / COLS
    dh = p.height * 0.135
    rows = Math.ceil(p.height / dh) + 2
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    p.noStroke()
    for (let i = 0; i < COLS; i++) {
      reels.push({ pos: p.random(1000), base: p.random(0.7, 4.2), ph: p.random(p.TWO_PI) })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const cy = p.height * 0.5
    const f = p.frameCount

    // center readout band
    const band = p.color(pal.ink)
    band.setAlpha(255)
    p.fill(band)
    p.rect(0, cy - dh * 0.52, p.width, dh * 1.04)

    p.textSize(dh * 0.62)
    for (let i = 0; i < COLS; i++) {
      const r = reels[i]!
      // each reel eases and occasionally locks, then resumes
      const gate = p.noise(i * 3.7, f * 0.004)
      const swing = Math.pow(0.55 + 0.45 * Math.sin(f * 0.013 + r.ph), 2)
      r.pos += r.base * swing * (gate < 0.32 ? 0.05 : 1)

      const x = margin + colW * (i + 0.5)
      const frac = r.pos % dh
      const head = Math.floor(r.pos / dh)
      for (let k = -1; k < rows; k++) {
        const y = cy + (k - Math.floor(rows / 2)) * dh + frac
        if (y < -dh || y > p.height + dh) continue
        const d = (((head - k + Math.floor(rows / 2)) % 10) + 10) % 10
        const near = 1 - p.constrain(Math.abs(y - cy) / (p.height * 0.42), 0, 1)
        const centered = Math.abs(y - cy) < dh * 0.5
        const c = p.color(centered ? pal.accent : pal.signal)
        c.setAlpha(24 + 210 * Math.pow(near, 1.7))
        p.fill(c)
        p.text(String(d), x, y)
      }
    }

    // top / bottom shade so reels read as drums
    for (let i = 0; i < 12; i++) {
      const shade = p.color(pal.bg)
      shade.setAlpha(20 + i * 20)
      p.fill(shade)
      const h = p.height * 0.02
      p.rect(0, p.height * 0.16 - i * h, p.width, h + 1)
      p.rect(0, p.height * 0.84 + i * h, p.width, h + 1)
    }

    // instrument chrome
    const mark = p.color(pal.accent)
    mark.setAlpha(200)
    p.fill(mark)
    p.rect(margin * 0.4, cy - dh * 0.52, margin * 0.16, dh * 1.04)
    p.rect(p.width - margin * 0.56, cy - dh * 0.52, margin * 0.16, dh * 1.04)
    const rule = p.color(pal.dim)
    rule.setAlpha(90)
    p.fill(rule)
    p.rect(0, cy - dh * 0.52, p.width, 1)
    p.rect(0, cy + dh * 0.52, p.width, 1)

    p.textSize(p.width * 0.022)
    const tag = p.color(pal.dim)
    tag.setAlpha(150)
    p.fill(tag)
    for (let i = 0; i < COLS; i++) {
      p.text('CH' + (i + 1), margin + colW * (i + 0.5), p.height * 0.075)
    }
  }
}
