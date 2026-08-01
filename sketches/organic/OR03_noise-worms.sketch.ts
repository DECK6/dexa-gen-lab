import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const WORMS = 24
const SEGS = 15
const SEG_LEN = 5.4
const SPEED = 1.6

type Worm = { seg: { x: number; y: number }[]; a: number; scale: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const worms: Worm[] = []

  const spawn = (w: Worm) => {
    const x = p.random(p.width)
    const y = p.random(p.height)
    w.a = p.random(p.TWO_PI)
    w.scale = p.random(0.65, 1.35)
    for (const s of w.seg) {
      s.x = x
      s.y = y
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < WORMS; i++) {
      const seg: { x: number; y: number }[] = []
      for (let j = 0; j < SEGS; j++) seg.push({ x: 0, y: 0 })
      const w: Worm = { seg, a: 0, scale: 1 }
      spawn(w)
      worms.push(w)
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(34)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const t = p.frameCount * 0.004
    const body = p.color(pal.signal)
    const head = p.color(pal.accent)

    for (const w of worms) {
      const h = w.seg[0]!
      const field = p.noise(h.x * 0.0042, h.y * 0.0042, t) * p.TWO_PI * 2
      let turn = p.constrain(Math.atan2(Math.sin(field - w.a), Math.cos(field - w.a)), -0.12, 0.12)
      const m = 46
      if (h.x < m || h.x > p.width - m || h.y < m || h.y > p.height - m) {
        const inward = Math.atan2(p.height / 2 - h.y, p.width / 2 - h.x)
        turn = p.constrain(Math.atan2(Math.sin(inward - w.a), Math.cos(inward - w.a)), -0.09, 0.09)
      }
      w.a += turn
      const undulate = Math.sin(p.frameCount * 0.22 + w.scale * 9) * 0.11
      h.x += Math.cos(w.a + undulate) * SPEED * w.scale
      h.y += Math.sin(w.a + undulate) * SPEED * w.scale

      for (let i = 1; i < w.seg.length; i++) {
        const a = w.seg[i - 1]!
        const b = w.seg[i]!
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 1
        const len = SEG_LEN * w.scale
        b.x = a.x + (dx / d) * len
        b.y = a.y + (dy / d) * len
      }

      p.noFill()
      for (let i = 0; i < w.seg.length; i++) {
        const s = w.seg[i]!
        const k = 1 - i / w.seg.length
        body.setAlpha(40 + k * 130)
        p.stroke(body)
        p.strokeWeight(0.8)
        const r = (2.2 + k * 5.4) * w.scale
        p.ellipse(s.x, s.y, r * 2, r * 1.5)
      }
      body.setAlpha(90)
      p.stroke(body)
      p.strokeWeight(1)
      p.beginShape()
      for (const s of w.seg) p.vertex(s.x, s.y)
      p.endShape()

      head.setAlpha(210)
      p.noStroke()
      p.fill(head)
      p.ellipse(h.x, h.y, 2.8, 2.8)

      if (p.random() < 0.0016) spawn(w)
    }

    const dust = p.color(pal.dim)
    dust.setAlpha(70)
    p.stroke(dust)
    p.strokeWeight(1)
    for (let i = 0; i < 14; i++) p.point(p.random(p.width), p.random(p.height))
  }
}
