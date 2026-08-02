import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 320

interface Filing {
  x: number
  y: number
  vx: number
  vy: number
  owner: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const filings: Filing[] = []

  const scatter = (o: Filing) => {
    o.x = p.width / 2 + p.random(-p.width * 0.16, p.width * 0.16)
    o.y = p.height / 2 + p.random(-p.height * 0.4, p.height * 0.4)
    o.vx = p.random(-0.6, 0.6)
    o.vy = p.random(-0.6, 0.6)
    o.owner = p.random() < 0.5 ? -1 : 1
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      const o: Filing = { x: 0, y: 0, vx: 0, vy: 0, owner: 1 }
      scatter(o)
      filings.push(o)
    }
  }

  p.draw = () => {
    const f = p.frameCount
    const ax = p.width * (0.28 + 0.08 * Math.sin(f * 0.009))
    const ay = p.height * (0.5 + 0.25 * Math.sin(f * 0.006))
    const bx = p.width * (0.72 + 0.08 * Math.sin(f * 0.007 + 2))
    const by = p.height * (0.5 + 0.25 * Math.sin(f * 0.008 + 3))
    const veil = p.color(pal.bg)
    veil.setAlpha(26)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cyan = p.color(pal.signal)
    cyan.setAlpha(150)
    const secondary = p.color(pal.dim)
    secondary.setAlpha(145)
    const orange = p.color(pal.accent)
    orange.setAlpha(210)
    p.strokeWeight(1)
    for (let i = 0; i < filings.length; i++) {
      const o = filings[i]
      const dax = ax - o.x
      const day = ay - o.y
      const dbx = bx - o.x
      const dby = by - o.y
      const da2 = dax * dax + day * day + 500
      const db2 = dbx * dbx + dby * dby + 500
      const strengthA = 1 / da2
      const strengthB = 1 / db2
      if (strengthA > strengthB * 1.18) o.owner = -1
      else if (strengthB > strengthA * 1.18) o.owner = 1
      const dx = o.owner < 0 ? dax : dbx
      const dy = o.owner < 0 ? day : dby
      const d2 = o.owner < 0 ? da2 : db2
      const pull = p.width * 0.08 / d2
      o.vx = (o.vx + dx * pull) * 0.975
      o.vy = (o.vy + dy * pull) * 0.975
      const ox = o.x
      const oy = o.y
      o.x += o.vx
      o.y += o.vy
      p.stroke(o.owner < 0 ? cyan : secondary)
      p.line(ox, oy, o.x, o.y)
      if (d2 < 210 || o.x < 0 || o.x > p.width || o.y < 0 || o.y > p.height) scatter(o)
    }

    p.noFill()
    p.strokeWeight(2)
    p.stroke(cyan)
    p.ellipse(ax, ay, 18)
    p.stroke(orange)
    p.ellipse(bx, by, 18)
  }
}
