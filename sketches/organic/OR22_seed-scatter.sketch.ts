import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 74
const RELEASE = 18
const CYCLE = 350

type Seed = { x: number; y: number; vx: number; vy: number; spin: number; size: number; landed: number; hot: boolean }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let seeds: Seed[] = []
  let age = 0
  let sourceX = 0
  let sourceY = 0
  let ground = 0

  const reset = () => {
    sourceX = p.width * p.random(0.42, 0.58)
    sourceY = p.height * 0.42
    seeds = []
    for (let i = 0; i < COUNT; i++) seeds.push({ x: sourceX, y: sourceY, vx: p.random(-4.8, 4.8), vy: p.random(-6.2, -2), spin: p.random(p.TWO_PI), size: p.random(3.5, 6.5), landed: 0, hot: p.random() < 0.08 })
    age = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    ground = p.height * 0.84
    reset()
  }

  p.draw = () => {
    p.background(pal.bg)
    age++
    if (age >= CYCLE) reset()
    const fade = age > 300 ? 1 - (age - 300) / 50 : 1
    const guide = p.color(pal.dim)
    guide.setAlpha(90 * fade)
    p.stroke(guide)
    p.line(p.width * 0.06, ground, p.width * 0.94, ground)
    if (age < RELEASE + 20) {
      const pod = p.color(pal.accent)
      pod.setAlpha(Math.max(0, 210 - Math.max(0, age - RELEASE) * 11) * fade)
      p.noFill()
      p.stroke(pod)
      p.strokeWeight(2)
      p.arc(sourceX, sourceY, 42, 64, -p.PI * 0.85, p.PI * 0.85)
    }
    if (age < RELEASE) return
    const seedCol = p.color(pal.signal)
    const hot = p.color(pal.accent)
    for (const s of seeds) {
      if (s.landed === 0) {
        s.vx += (p.noise(s.y * 0.008, p.frameCount * 0.01) - 0.48) * 0.04
        s.vy += 0.13
        s.x += s.vx
        s.y += s.vy
        s.spin += s.vx * 0.035
        if (s.x < 12 || s.x > p.width - 12) s.vx *= -0.72
        if (s.y >= ground) {
          s.y = ground
          s.vx = 0
          s.vy = 0
          s.landed = 1
        }
      } else s.landed++
      const col = s.hot ? hot : seedCol
      col.setAlpha((s.hot ? 220 : 155) * fade)
      if (s.landed > 0) {
        const stem = Math.min(p.height * 0.13, Math.max(0, s.landed - 8) * 0.75)
        p.stroke(col)
        p.strokeWeight(1.2)
        p.line(s.x, ground, s.x + Math.sin(s.x * 0.1) * 3, ground - stem)
        if (stem > 12) {
          p.noFill()
          p.ellipse(s.x - 4, ground - stem, 9, 4)
          p.ellipse(s.x + 4, ground - stem + 3, 9, 4)
        }
      } else {
        p.push()
        p.translate(s.x, s.y)
        p.rotate(s.spin)
        p.noFill()
        p.stroke(col)
        p.ellipse(0, 0, s.size, s.size * 1.8)
        p.line(0, 0, s.size * 1.4, 0)
        p.pop()
      }
    }
  }
}
