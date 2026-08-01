import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const VARIANT = 7

export function sketch(p: P5, ctx: SketchCtx): void {
  const particles: { x: number; y: number; age: number }[] = []

  function reset(particle: { x: number; y: number; age: number }) {
    particle.x = p.random(ctx.width)
    particle.y = p.random(ctx.height)
    particle.age = p.random(80, 260)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.background(ctx.palette.bg)
    for (let i = 0; i < 360 + VARIANT * 30; i++) {
      const particle = { x: 0, y: 0, age: 0 }
      reset(particle)
      particles.push(particle)
    }
  }

  p.draw = () => {
    const veil = p.color(ctx.palette.bg)
    veil.setAlpha(20 + (VARIANT % 4) * 4)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, ctx.width, ctx.height)
    const t = p.frameCount * 0.002
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]!
      const angle = p.noise(particle.x * 0.004, particle.y * 0.004, t) * p.TWO_PI * (2.2 + VARIANT * 0.13)
        + Math.sin(t * 11 + i * 0.01) * 0.16
      const speed = 0.7 + (i % 7) * 0.16 + VARIANT * 0.04
      particle.x += Math.cos(angle) * speed
      particle.y += Math.sin(angle) * speed - (VARIANT % 3 === 0 ? 0.2 : 0)
      particle.age--
      if (particle.age < 0 || particle.x < 0 || particle.x > ctx.width || particle.y < 0 || particle.y > ctx.height) reset(particle)
      const color = p.color(i % (7 + VARIANT) === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(70 + (i % 5) * 18)
      p.fill(color)
      p.circle(particle.x, particle.y, 1.4 + (i % 3))
    }
  }
}
