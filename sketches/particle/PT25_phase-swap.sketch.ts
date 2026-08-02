import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 150

interface Dancer {
  angle: number
  radius: number
  phase: number
  group: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const dancers: Dancer[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let group = 0; group < 2; group++) {
      for (let i = 0; i < COUNT; i++) {
        dancers.push({ angle: p.random(p.TWO_PI), radius: Math.sqrt(p.random()) * p.width * 0.105, phase: p.random(p.TWO_PI), group })
      }
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(30)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const t = p.frameCount * 0.012
    const travel = Math.sin(t)
    const weave = Math.sin(t * 2)
    const ax = p.width * (0.5 - travel * 0.28)
    const bx = p.width * (0.5 + travel * 0.28)
    const ay = p.height * (0.5 + weave * 0.11)
    const by = p.height * (0.5 - weave * 0.11)
    const cyan = p.color(pal.signal)
    cyan.setAlpha(150)
    const secondary = p.color(pal.dim)
    secondary.setAlpha(165)
    p.strokeWeight(1)
    for (let i = 0; i < dancers.length; i++) {
      const o = dancers[i]
      const cx = o.group === 0 ? ax : bx
      const cy = o.group === 0 ? ay : by
      const direction = o.group === 0 ? 1 : -1
      const angle = o.angle + t * direction * 0.7 + Math.sin(t + o.phase) * 0.18
      const pulse = 0.82 + Math.sin(t * 2 + o.phase) * 0.18
      const x = cx + Math.cos(angle) * o.radius * pulse
      const y = cy + Math.sin(angle) * o.radius * pulse
      const tail = angle - direction * 0.08
      p.stroke(o.group === 0 ? cyan : secondary)
      p.line(x, y, cx + Math.cos(tail) * o.radius * pulse, cy + Math.sin(tail) * o.radius * pulse)
    }

    const axis = p.color(pal.dim)
    axis.setAlpha(110)
    p.stroke(axis)
    p.line(p.width * 0.16, p.height / 2, p.width * 0.84, p.height / 2)
    const mark = p.color(pal.accent)
    mark.setAlpha(210)
    p.stroke(mark)
    const meterX = p.width * (0.5 + travel * 0.34)
    p.line(meterX, p.height * 0.91, meterX, p.height * 0.94)
  }
}
