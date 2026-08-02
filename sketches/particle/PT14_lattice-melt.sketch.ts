import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SIDE = 24

interface Atom {
  x: number
  y: number
  vx: number
  vy: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const atoms: Atom[] = []
  let gap = 0

  const crystallize = () => {
    atoms.length = 0
    const pad = p.width * 0.1
    gap = (p.width - pad * 2) / (SIDE - 1)
    for (let r = 0; r < SIDE; r++) {
      for (let c = 0; c < SIDE; c++) atoms.push({ x: pad + c * gap, y: pad + r * gap, vx: 0, vy: 0 })
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    crystallize()
  }

  p.draw = () => {
    if (p.frameCount % 600 === 0) crystallize()
    const phase = (p.frameCount % 600) / 600
    const heat = (1 - Math.cos(phase * p.TWO_PI)) / 2
    const bond = (1 - heat) * 0.042
    const veil = p.color(pal.bg)
    veil.setAlpha(38)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    for (let r = 0; r < SIDE; r++) {
      for (let c = 0; c < SIDE; c++) {
        const i = r * SIDE + c
        const a = atoms[i]
        if (c + 1 < SIDE) {
          const b = atoms[i + 1]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d = Math.hypot(dx, dy) || 1
          const pull = (d - gap) * bond
          a.vx += (dx / d) * pull
          a.vy += (dy / d) * pull
          b.vx -= (dx / d) * pull
          b.vy -= (dy / d) * pull
        }
        if (r + 1 < SIDE) {
          const b = atoms[i + SIDE]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d = Math.hypot(dx, dy) || 1
          const pull = (d - gap) * bond
          a.vx += (dx / d) * pull
          a.vy += (dy / d) * pull
          b.vx -= (dx / d) * pull
          b.vy -= (dy / d) * pull
        }
      }
    }

    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    p.strokeWeight(1)
    for (let i = 0; i < atoms.length; i++) {
      const o = atoms[i]
      o.vx = (o.vx + p.random(-heat, heat) * 0.24) * (0.9 + heat * 0.075)
      o.vy = (o.vy + p.random(-heat, heat) * 0.24) * (0.9 + heat * 0.075)
      const ox = o.x
      const oy = o.y
      o.x += o.vx
      o.y += o.vy
      if (o.x < 8 || o.x > p.width - 8) o.vx *= -1
      if (o.y < 8 || o.y > p.height - 8) o.vy *= -1
      o.x = p.constrain(o.x, 8, p.width - 8)
      o.y = p.constrain(o.y, 8, p.height - 8)
      cyan.setAlpha(80 + (1 - heat) * 120)
      orange.setAlpha(70 + heat * 150)
      p.stroke(i % 47 === 0 ? orange : cyan)
      p.line(ox, oy, o.x, o.y)
      p.point(o.x, o.y)
    }

    const meter = p.color(pal.accent)
    meter.setAlpha(170)
    p.stroke(meter)
    p.line(p.width * 0.08, p.height * 0.94, p.width * (0.08 + heat * 0.24), p.height * 0.94)
  }
}
