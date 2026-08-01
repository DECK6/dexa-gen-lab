import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const STALKS = 14
const SEGS = 28
const MOTES = 90

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const stalks: { x: number; seed: number; len: number; bend: number }[] = []
  const motes: { x: number; y: number; v: number }[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < STALKS; i++) {
      stalks.push({
        x: p.width * ((i + 0.5) / STALKS) + p.random(-14, 14),
        seed: p.random(100),
        len: p.random(0.62, 1),
        bend: p.random(0.1, 0.2),
      })
    }
    for (let i = 0; i < MOTES; i++) {
      motes.push({ x: p.random(p.width), y: p.random(p.height), v: p.random(0.25, 0.9) })
    }
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(42)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const t = p.frameCount * 0.006
    const current = (p.noise(t * 0.7, 40) - 0.5) * 1.9
    const stem = p.color(pal.signal)
    const blade = p.color(pal.signal)
    const tipCol = p.color(pal.accent)

    for (const s of stalks) {
      const segLen = (p.height / SEGS) * s.len
      let x = s.x
      let y = p.height + 6
      let a = -p.PI / 2
      p.noFill()
      for (let i = 0; i < SEGS; i++) {
        const k = i / SEGS
        const wave = p.noise(i * 0.17, s.seed, t) - 0.5
        a += wave * s.bend * (0.35 + k * 1.8) + current * 0.028 * (0.2 + k * 1.5)
        const nxp = x + Math.cos(a) * segLen
        const nyp = y + Math.sin(a) * segLen
        stem.setAlpha(150 - k * 70)
        p.stroke(stem)
        p.strokeWeight(3.2 * (1 - k) + 0.7)
        p.line(x, y, nxp, nyp)
        if (i % 3 === 1 && i > 2) {
          const side = i % 6 === 1 ? 1 : -1
          const bl = segLen * (1.6 - k * 0.9)
          const ba = a + side * (0.85 + wave * 0.5)
          blade.setAlpha(70 - k * 30)
          p.stroke(blade)
          p.strokeWeight(1)
          p.line(nxp, nyp, nxp + Math.cos(ba) * bl, nyp + Math.sin(ba) * bl * 0.75)
        }
        x = nxp
        y = nyp
      }
      const pulse = 2.4 + Math.sin(p.frameCount * 0.06 + s.seed) * 0.8
      tipCol.setAlpha(210)
      p.noStroke()
      p.fill(tipCol)
      p.ellipse(x, y, pulse, pulse)
    }

    const mote = p.color(pal.dim)
    p.strokeWeight(1)
    for (const m of motes) {
      m.y -= m.v
      m.x += current * 0.5 * m.v + (p.noise(m.y * 0.01, m.x * 0.01, t) - 0.5) * 1.2
      if (m.y < -4) {
        m.y = p.height + 4
        m.x = p.random(p.width)
      }
      mote.setAlpha(40 + m.v * 90)
      p.stroke(mote)
      p.point(m.x, m.y)
    }
  }
}
