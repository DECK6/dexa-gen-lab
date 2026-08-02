import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const ORDER = 4
const TRACERS = 5
const TRAIL = 90

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const xs: number[] = []
  const ys: number[] = []
  let scale = 1
  let ox = 0
  let oy = 0
  let phase = 0

  const expand = (src: string): string => {
    let out = ''
    for (const ch of src) {
      if (ch === 'A') out += 'A-B--B+A++AA+B-'
      else if (ch === 'B') out += '+A-BB--B-A++A+B'
      else out += ch
    }
    return out
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    let rule = 'A'
    for (let i = 0; i < ORDER; i++) rule = expand(rule)
    let x = 0
    let y = 0
    let angle = 0
    xs.push(x)
    ys.push(y)
    for (const ch of rule) {
      if (ch === 'A' || ch === 'B') {
        x += Math.cos(angle)
        y += Math.sin(angle)
        xs.push(x)
        ys.push(y)
      } else if (ch === '+') angle += p.PI / 3
      else if (ch === '-') angle -= p.PI / 3
    }
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    scale = Math.min((p.width * 0.82) / (maxX - minX), (p.height * 0.82) / (maxY - minY))
    ox = -((minX + maxX) * scale) / 2
    oy = -((minY + maxY) * scale) / 2
    p.noFill()
  }

  p.draw = () => {
    p.background(pal.bg)
    p.push()
    p.translate(p.width / 2, p.height / 2)
    p.rotate(Math.sin(p.frameCount * 0.004 + phase) * 0.08)
    const base = p.color(pal.dim)
    base.setAlpha(68)
    p.stroke(base)
    p.strokeWeight(1)
    p.beginShape()
    for (let i = 0; i < xs.length; i++) p.vertex(ox + xs[i]! * scale, oy + ys[i]! * scale)
    p.endShape()

    const cyan = p.color(pal.signal)
    cyan.setAlpha(185)
    p.stroke(cyan)
    p.strokeWeight(1.8)
    for (let tracer = 0; tracer < TRACERS; tracer++) {
      const head = Math.floor((p.frameCount * 4 + (tracer * xs.length) / TRACERS) % xs.length)
      p.beginShape()
      for (let i = Math.max(0, head - TRAIL); i <= head; i++) p.vertex(ox + xs[i]! * scale, oy + ys[i]! * scale)
      p.endShape()
    }
    const head = Math.floor((p.frameCount * 4) % xs.length)
    const hot = p.color(pal.accent)
    hot.setAlpha(230)
    p.stroke(hot)
    p.strokeWeight(4)
    p.point(ox + xs[head]! * scale, oy + ys[head]! * scale)
    p.pop()
  }
}
