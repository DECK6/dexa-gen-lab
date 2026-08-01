import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SEG = 30
const DT = 0.02
const SPAN = 360 // t units per drawing cycle

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const f = [0, 0, 0, 0]
  const ph = [0, 0, 0, 0]
  const am = [0, 0, 0, 0]
  const dc = [0, 0, 0, 0]
  let t = 0
  let cx = 0
  let cy = 0
  let main = { x: 0, y: 0 }
  let ghost = { x: 0, y: 0 }

  const pen = (tt: number, detune: number) => {
    const e = (i: number) =>
      am[i] * Math.exp(-dc[i] * tt) * Math.sin(f[i] * detune * tt + ph[i])
    return { x: cx + e(0) + e(1), y: cy + e(2) + e(3) }
  }

  const reseed = () => {
    const reach = Math.min(p.width, p.height) * 0.23
    for (let i = 0; i < 4; i++) {
      // near-integer ratios: slight detune is what opens the rosette
      f[i] = Math.floor(p.random(1, 5)) * (1 + p.random(-0.005, 0.005))
      ph[i] = p.random(p.TWO_PI)
      am[i] = reach * p.random(0.55, 1)
      dc[i] = p.random(0.002, 0.011)
    }
    t = 0
    main = pen(0, 1)
    ghost = pen(0, 1.004)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    cx = p.width / 2
    cy = p.height / 2
    p.strokeWeight(1)
    reseed()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(2)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const fade = 1 - t / SPAN
    const cyan = p.color(pal.signal)
    cyan.setAlpha(18 + 42 * fade)
    const orange = p.color(pal.accent)
    orange.setAlpha(10 + 20 * fade)

    for (let i = 0; i < SEG; i++) {
      t += DT
      const m = pen(t, 1)
      p.stroke(cyan)
      p.line(main.x, main.y, m.x, m.y)
      main = m
      if (i % 3 === 0) {
        const g = pen(t, 1.004)
        p.stroke(orange)
        p.line(ghost.x, ghost.y, g.x, g.y)
        ghost = g
      }
    }

    if (t > SPAN) reseed()
  }
}
