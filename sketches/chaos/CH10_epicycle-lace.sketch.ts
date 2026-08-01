import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const K = 4
const SEG = 480
const STEPS = 1500
const CYCLES = 90

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const ratio: number[] = []
  const amp: number[] = []
  const phase: number[] = []
  const drift: number[] = []
  let th = 0
  let cx = 0
  let cy = 0
  let span = 0
  let cycles = 0
  let prev = { x: 0, y: 0 }

  const pen = (a: number) => {
    let x = 0
    let y = 0
    for (let k = 0; k < K; k++) {
      x += amp[k] * Math.cos(ratio[k] * a + phase[k])
      y += amp[k] * Math.sin(ratio[k] * a + phase[k])
    }
    return { x: cx + x, y: cy + y }
  }

  const reseed = () => {
    ratio.length = 0
    amp.length = 0
    phase.length = 0
    drift.length = 0
    let total = 0
    for (let k = 0; k < K; k++) {
      // integer ratios only — that is what closes the curve into lace
      ratio.push(Math.floor(p.random(1, 10)) * (p.random() < 0.5 ? -1 : 1))
      const a = p.random(0.25, 1)
      amp.push(a)
      total += a
      phase.push(p.random(p.TWO_PI))
      drift.push(p.random(-0.0016, 0.0016))
    }
    for (let k = 0; k < K; k++) amp[k] = (amp[k] / total) * span
    th = 0
    cycles = 0
    prev = pen(0)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    cx = p.width / 2
    cy = p.height / 2
    span = Math.min(p.width, p.height) * 0.42
    p.strokeWeight(1)
    reseed()
  }

  p.draw = () => {
    // first frames run hot so the weave is legible within a second
    const boost = p.constrain(1 - (p.frameCount - 100) / 300, 0, 1)

    const veil = p.color(pal.bg)
    veil.setAlpha(3 - boost)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    // phases creep, so the woven pattern never repeats exactly
    for (let k = 0; k < K; k++) phase[k] += drift[k]

    const cyan = p.color(pal.signal)
    cyan.setAlpha(30 + 20 * boost)
    p.stroke(cyan)
    p.strokeWeight(1 + 0.35 * boost)
    const dth = p.TWO_PI / STEPS
    for (let i = 0; i < SEG; i++) {
      th += dth
      const q = pen(th)
      p.line(prev.x, prev.y, q.x, q.y)
      prev = q
    }

    if (th > p.TWO_PI) {
      th -= p.TWO_PI
      cycles++
    }

    const spark = p.color(pal.accent)
    spark.setAlpha(85)
    p.stroke(spark)
    p.strokeWeight(1.8)
    p.point(prev.x, prev.y)
    p.strokeWeight(1)

    if (cycles > CYCLES) reseed()
  }
}
