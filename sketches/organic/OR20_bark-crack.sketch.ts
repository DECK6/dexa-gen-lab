import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MAX_SEGS = 1700
const MAX_TIPS = 42

type Tip = { x: number; y: number; a: number; life: number; w: number }
type Seg = { x1: number; y1: number; x2: number; y2: number; w: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let tips: Tip[] = []
  let segs: Seg[] = []
  let seed = 0
  let hold = 0

  const reset = () => {
    tips = []
    segs = []
    seed = p.random(100)
    const cx = p.width * p.random(0.42, 0.58)
    const cy = p.height * p.random(0.42, 0.58)
    for (let i = 0; i < 7; i++) tips.push({ x: cx, y: cy, a: (i / 7) * p.TWO_PI + p.random(-0.2, 0.2), life: 0, w: p.random(1.4, 2.5) })
    hold = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.strokeCap(p.ROUND)
    reset()
  }

  const stress = (x: number, y: number) => p.noise(seed + x * 0.006, y * 0.008) + Math.sin((x - y) * 0.018) * 0.14

  const advance = () => {
    for (let i = tips.length - 1; i >= 0 && segs.length < MAX_SEGS; i--) {
      const q = tips[i]!
      let bestA = q.a
      let best = -Infinity
      for (let k = -3; k <= 3; k++) {
        const a = q.a + k * 0.11
        const nx = q.x + Math.cos(a) * 3.1
        const ny = q.y + Math.sin(a) * 3.1
        const score = stress(nx, ny) - Math.abs(k) * 0.025
        if (score > best) {
          best = score
          bestA = a
        }
      }
      const nx = q.x + Math.cos(bestA) * 3.1
      const ny = q.y + Math.sin(bestA) * 3.1
      let hit = nx < 18 || ny < 18 || nx > p.width - 18 || ny > p.height - 18
      for (let j = 0; j < segs.length - 18 && !hit; j += 3) {
        const s = segs[j]!
        hit = (s.x2 - nx) ** 2 + (s.y2 - ny) ** 2 < 30
      }
      if (hit) {
        tips.splice(i, 1)
        continue
      }
      segs.push({ x1: q.x, y1: q.y, x2: nx, y2: ny, w: q.w })
      q.x = nx
      q.y = ny
      q.a = bestA
      q.life++
      q.w *= 0.999
      if (tips.length < MAX_TIPS && q.life > 14 && best > 0.54 && p.random() < 0.012) {
        tips.push({ x: q.x, y: q.y, a: q.a + p.random(-0.9, 0.9), life: 0, w: q.w * 0.72 })
      }
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    if (tips.length > 0 && segs.length < MAX_SEGS) {
      advance()
      advance()
    } else hold++
    if (hold > 210) reset()
    const fade = hold > 150 ? 1 - (hold - 150) / 60 : 1
    const grain = p.color(pal.dim)
    grain.setAlpha(38 * fade)
    p.noFill()
    p.stroke(grain)
    p.strokeWeight(1)
    for (let row = 1; row < 20; row++) {
      p.beginShape()
      for (let x = 0; x <= p.width; x += 16) p.vertex(x, (row / 20) * p.height + (p.noise(seed + row, x * 0.009, p.frameCount * 0.001) - 0.5) * 18)
      p.endShape()
    }
    const crack = p.color(pal.signal)
    for (const s of segs) {
      crack.setAlpha(150 * fade)
      p.stroke(crack)
      p.strokeWeight(s.w)
      p.line(s.x1, s.y1, s.x2, s.y2)
    }
    const hot = p.color(pal.accent)
    hot.setAlpha(220 * fade)
    p.noStroke()
    p.fill(hot)
    for (const q of tips) p.ellipse(q.x, q.y, 3.5)
  }
}
