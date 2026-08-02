import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SHELLS = 8
const PER_SHELL = 38

interface Orbiter {
  shell: number
  angle: number
  offset: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const orbiters: Orbiter[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let s = 0; s < SHELLS; s++) {
      for (let i = 0; i < PER_SHELL; i++) {
        orbiters.push({ shell: s, angle: p.random(p.TWO_PI), offset: p.random(-5, 5), hot: i === 0 && s % 2 === 0 })
      }
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const cx = p.width / 2
    const cy = p.height / 2
    const guide = p.color(pal.dim)
    guide.setAlpha(75)
    p.noFill()
    p.stroke(guide)
    p.strokeWeight(1)
    for (let s = 0; s < SHELLS; s++) {
      const radius = p.width * (0.075 + s * 0.047)
      p.ellipse(cx, cy, radius * 2)
    }

    const cyan = p.color(pal.signal)
    cyan.setAlpha(180)
    const orange = p.color(pal.accent)
    orange.setAlpha(220)
    p.strokeWeight(1)
    for (let i = 0; i < orbiters.length; i++) {
      const o = orbiters[i]
      const direction = o.shell % 2 === 0 ? 1 : -1
      const speed = direction * (0.012 / Math.sqrt(o.shell + 1))
      const radius = p.width * (0.075 + o.shell * 0.047) + o.offset + Math.sin(p.frameCount * 0.025 + o.angle * 3) * 2
      const ox = cx + Math.cos(o.angle) * radius
      const oy = cy + Math.sin(o.angle) * radius
      o.angle += speed
      const x = cx + Math.cos(o.angle) * radius
      const y = cy + Math.sin(o.angle) * radius
      p.stroke(o.hot ? orange : cyan)
      p.line(ox, oy, x, y)
      p.point(x, y)
    }

    const axis = p.color(pal.accent)
    axis.setAlpha(170)
    p.stroke(axis)
    p.line(cx - 7, cy, cx + 7, cy)
    p.line(cx, cy - 7, cx, cy + 7)
  }
}
