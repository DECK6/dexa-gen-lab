import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 900
const SPEED = 1.7
const SCALE = 0.0021

interface Spore {
  x: number
  y: number
  age: number
  life: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const spores: Spore[] = []

  const angleAt = (x: number, y: number, z: number) =>
    p.noise(x * SCALE, y * SCALE, z) * p.TWO_PI * 1.7 + z * 2

  const born = (s: Spore) => {
    s.x = p.random(p.width)
    s.y = p.random(p.height)
    s.age = 0
    s.life = p.random(60, 230)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      const s = { x: 0, y: 0, age: 0, life: 1 }
      born(s)
      s.age = p.random(s.life)
      spores.push(s)
    }
    p.strokeWeight(1)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(34)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const z = p.frameCount * 0.0013
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)

    for (let i = 0; i < COUNT; i++) {
      const s = spores[i]!
      s.age++
      if (s.age >= s.life || s.x < -20 || s.x > p.width + 20 || s.y < -20 || s.y > p.height + 20) {
        born(s)
        continue
      }
      const ox = s.x
      const oy = s.y
      const a = angleAt(ox, oy, z)
      s.x = ox + Math.cos(a) * SPEED
      s.y = oy + Math.sin(a) * SPEED

      // Fade in on birth, out on death — the population blinks in and out.
      const fade = Math.sin((s.age / s.life) * p.PI)
      const hot = i % 43 === 0
      const col = hot ? orange : cyan
      col.setAlpha(fade * 60)
      p.stroke(col)
      p.noFill()
      p.line(ox, oy, s.x, s.y)

      col.setAlpha(30 + fade * 190)
      p.noStroke()
      p.fill(col)
      p.circle(s.x, s.y, 1.3 + fade * (hot ? 5.4 : 3.4))
    }
  }
}
