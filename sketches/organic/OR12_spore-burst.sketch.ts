import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 260
const BURST_AT = 28
const CYCLE = 280

type Spore = { x: number; y: number; angle: number; phase: number; settled: number; size: number; hot: boolean }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let spores: Spore[] = []
  let age = 0
  let cx = 0
  let cy = 0

  const reset = () => {
    cx = p.width * p.random(0.42, 0.58)
    cy = p.height * p.random(0.3, 0.4)
    spores = []
    for (let i = 0; i < COUNT; i++) {
      const a = p.random(p.TWO_PI)
      spores.push({ x: cx, y: cy, angle: a, phase: p.random(100), settled: 0, size: p.random(1.2, 2.8), hot: p.random() < 0.035 })
    }
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    reset()
  }

  p.draw = () => {
    p.background(pal.bg)
    age++
    if (age >= CYCLE) reset()
    const fade = age > CYCLE - 45 ? 1 - (age - CYCLE + 45) / 45 : 1
    const guide = p.color(pal.dim)
    guide.setAlpha(70 * fade)
    p.noFill()
    p.stroke(guide)
    p.strokeWeight(1)
    p.ellipse(cx, cy, p.width * 0.42, p.width * 0.42)

    const shell = p.color(pal.signal)
    if (age < BURST_AT + 18) {
      const swell = 22 + Math.min(age, BURST_AT) * 0.72
      shell.setAlpha((age < BURST_AT ? 155 : Math.max(0, 170 - (age - BURST_AT) * 10)) * fade)
      p.noFill()
      p.stroke(shell)
      p.strokeWeight(2)
      p.ellipse(cx, cy, swell * 1.25, swell)
    }
    if (age < BURST_AT) return

    const grain = p.color(pal.signal)
    const hot = p.color(pal.accent)
    for (const s of spores) {
      const flight = age - BURST_AT
      if (s.settled === 0) {
        const radial = Math.max(0, 1 - flight / 48) * 4.2
        s.angle += (p.noise(s.phase, p.frameCount * 0.018) - 0.5) * 1.2
        s.x += Math.cos(s.angle) * (0.65 + radial)
        s.y += Math.sin(s.angle) * (0.65 + radial)
        if (s.x < 8 || s.x > p.width - 8) s.angle = p.PI - s.angle
        if (s.y < 8 || s.y > p.height - 8) s.angle = -s.angle
        if (flight > 45 && p.random() < 0.004) s.settled = 1
      } else s.settled++
      const col = s.hot ? hot : grain
      col.setAlpha((s.hot ? 220 : 135) * fade)
      p.noStroke()
      p.fill(col)
      p.ellipse(s.x, s.y, s.size, s.size)
      if (s.settled > 12) {
        const sprout = Math.min(15, (s.settled - 12) * 0.24)
        p.stroke(col)
        p.strokeWeight(1)
        p.line(s.x, s.y, s.x + Math.cos(s.phase) * sprout, s.y + Math.sin(s.phase) * sprout)
        p.line(s.x, s.y, s.x + Math.cos(s.phase + 2.2) * sprout * 0.7, s.y + Math.sin(s.phase + 2.2) * sprout * 0.7)
      }
    }
  }
}
