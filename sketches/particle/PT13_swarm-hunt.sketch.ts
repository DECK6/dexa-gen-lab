import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const HUNTERS = 96

interface Agent {
  x: number
  y: number
  vx: number
  vy: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const hunters: Agent[] = []
  const target: Agent = { x: 0, y: 0, vx: 0, vy: 0 }

  const resetTarget = () => {
    target.x = p.random(p.width * 0.25, p.width * 0.75)
    target.y = p.random(p.height * 0.25, p.height * 0.75)
    const a = p.random(p.TWO_PI)
    target.vx = Math.cos(a) * 2.7
    target.vy = Math.sin(a) * 2.7
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    resetTarget()
    for (let i = 0; i < HUNTERS; i++) {
      const a = p.random(p.TWO_PI)
      hunters.push({ x: p.random(p.width), y: p.random(p.height), vx: Math.cos(a), vy: Math.sin(a) })
    }
  }

  p.draw = () => {
    if (p.frameCount % 540 === 0) resetTarget()
    const veil = p.color(pal.bg)
    veil.setAlpha(28)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    let ex = 0
    let ey = 0
    for (let i = 0; i < hunters.length; i++) {
      const dx = target.x - hunters[i].x
      const dy = target.y - hunters[i].y
      const d2 = dx * dx + dy * dy + 100
      ex += dx / d2
      ey += dy / d2
    }
    const em = Math.hypot(ex, ey) || 1
    target.vx = target.vx * 0.94 + (ex / em) * 0.44
    target.vy = target.vy * 0.94 + (ey / em) * 0.44
    const margin = p.width * 0.13
    if (target.x < margin) target.vx += 0.25
    if (target.x > p.width - margin) target.vx -= 0.25
    if (target.y < margin) target.vy += 0.25
    if (target.y > p.height - margin) target.vy -= 0.25
    const ts = Math.hypot(target.vx, target.vy) || 1
    target.vx = (target.vx / ts) * 3.1
    target.vy = (target.vy / ts) * 3.1
    target.x += target.vx
    target.y += target.vy

    const cyan = p.color(pal.signal)
    cyan.setAlpha(145)
    p.stroke(cyan)
    p.strokeWeight(1)
    for (let i = 0; i < hunters.length; i++) {
      const o = hunters[i]
      let fx = target.x + target.vx * 12 - o.x
      let fy = target.y + target.vy * 12 - o.y
      const fm = Math.hypot(fx, fy) || 1
      fx /= fm
      fy /= fm
      for (let j = 0; j < hunters.length; j++) {
        if (i === j) continue
        const dx = o.x - hunters[j].x
        const dy = o.y - hunters[j].y
        const d2 = dx * dx + dy * dy
        if (d2 > 0 && d2 < 225) {
          fx += dx / d2
          fy += dy / d2
        }
      }
      o.vx = o.vx * 0.91 + fx * 0.18
      o.vy = o.vy * 0.91 + fy * 0.18
      const sp = Math.hypot(o.vx, o.vy) || 1
      o.vx = (o.vx / sp) * 2.35
      o.vy = (o.vy / sp) * 2.35
      o.x = p.constrain(o.x + o.vx, 0, p.width)
      o.y = p.constrain(o.y + o.vy, 0, p.height)
      p.line(o.x, o.y, o.x - o.vx * 4, o.y - o.vy * 4)
    }

    const mark = p.color(pal.accent)
    mark.setAlpha(220)
    p.noFill()
    p.stroke(mark)
    p.ellipse(target.x, target.y, 14 + Math.sin(p.frameCount * 0.16) * 4)
    p.line(target.x - 9, target.y, target.x + 9, target.y)
    p.line(target.x, target.y - 9, target.x, target.y + 9)
  }
}
