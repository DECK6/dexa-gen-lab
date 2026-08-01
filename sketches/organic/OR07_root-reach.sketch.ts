import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MOIST = 24
const MAX_TIPS = 46
const MAX_SEGS = 3000
const SENSE = 170

type Tip = { x: number; y: number; a: number; w: number; life: number }
type Seg = { x1: number; y1: number; x2: number; y2: number; w: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let segs: Seg[] = []
  let tips: Tip[] = []
  let moist: { x: number; y: number; r: number; used: number }[] = []
  let phase = 0
  let timer = 0

  const reset = () => {
    segs = []
    tips = [{ x: p.width / 2, y: 6, a: p.PI / 2, w: 3.4, life: 0 }]
    moist = []
    for (let i = 0; i < MOIST; i++) {
      moist.push({
        x: p.random(p.width * 0.08, p.width * 0.92),
        y: p.random(p.height * 0.22, p.height * 0.96),
        r: p.random(9, 20),
        used: 0,
      })
    }
    phase = 0
    timer = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.strokeCap(p.ROUND)
    reset()
  }

  const grow = () => {
    const t = p.frameCount * 0.005
    for (let i = tips.length - 1; i >= 0; i--) {
      const tp = tips[i]!
      let best = -1
      let bd = SENSE * SENSE
      for (let m = 0; m < moist.length; m++) {
        const q = moist[m]!
        if (q.used > 0) continue
        const d2 = (q.x - tp.x) ** 2 + (q.y - tp.y) ** 2
        if (d2 < bd) {
          bd = d2
          best = m
        }
      }
      if (best >= 0) {
        const q = moist[best]!
        const want = Math.atan2(q.y - tp.y, q.x - tp.x)
        tp.a += Math.atan2(Math.sin(want - tp.a), Math.cos(want - tp.a)) * 0.075
        if (bd < q.r * q.r) {
          q.used = 26
          tp.w = Math.min(3.2, tp.w * 1.25)
        }
      }
      tp.a += Math.atan2(Math.sin(p.PI / 2 - tp.a), Math.cos(p.PI / 2 - tp.a)) * 0.02
      tp.a += (p.noise(tp.x * 0.009, tp.y * 0.009, t) - 0.5) * 0.42
      const nxp = tp.x + Math.cos(tp.a) * 2.3
      const nyp = tp.y + Math.sin(tp.a) * 2.3
      segs.push({ x1: tp.x, y1: tp.y, x2: nxp, y2: nyp, w: tp.w })
      tp.x = nxp
      tp.y = nyp
      tp.w *= 0.9976
      tp.life++
      if (tips.length < MAX_TIPS && tp.w > 0.7 && p.random() < 0.014) {
        tips.push({ x: tp.x, y: tp.y, a: tp.a + p.random(-0.9, 0.9), w: tp.w * 0.66, life: 0 })
        tp.w *= 0.88
      }
      if (tp.y > p.height - 4 || tp.x < 4 || tp.x > p.width - 4 || tp.w < 0.34 || tp.life > 1100) {
        tips.splice(i, 1)
      }
    }
    for (const q of moist) if (q.used > 1) q.used--
  }

  p.draw = () => {
    p.background(pal.bg)
    if (phase === 0) {
      grow()
      if (tips.length === 0 || segs.length >= MAX_SEGS) {
        phase = 1
        timer = 0
      }
    } else if (phase === 1) {
      if (++timer > 160) {
        phase = 2
        timer = 0
      }
    } else if (++timer > 80) {
      reset()
      return
    }
    const fade = phase === 2 ? 1 - timer / 80 : 1

    const water = p.color(pal.dim)
    p.noFill()
    p.strokeWeight(1)
    for (const q of moist) {
      water.setAlpha((q.used > 0 ? 28 : 70) * fade)
      p.stroke(water)
      p.ellipse(q.x, q.y, q.r * 2, q.r * 2)
    }

    const root = p.color(pal.signal)
    const pulse = p.frameCount * 0.06
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i]!
      root.setAlpha((120 + Math.sin(pulse - i * 0.02) * 55) * fade)
      p.stroke(root)
      p.strokeWeight(s.w)
      p.line(s.x1, s.y1, s.x2, s.y2)
    }

    const cap = p.color(pal.accent)
    cap.setAlpha(220 * fade)
    p.noStroke()
    p.fill(cap)
    for (const tp of tips) p.ellipse(tp.x, tp.y, 3, 3)
    for (const q of moist) {
      if (q.used <= 1) continue
      const spread = q.r + (26 - q.used) * 1.7
      cap.setAlpha(q.used * 7 * fade)
      p.fill(cap)
      p.ellipse(q.x, q.y, spread, spread)
    }
  }
}
