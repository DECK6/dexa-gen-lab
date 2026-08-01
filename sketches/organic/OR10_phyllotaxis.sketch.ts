import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const FLORETS = 1400
const GOLDEN = 137.507764

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let grown = 0
  let diverge = 0
  let scale = 0
  let squash = 1
  let phase = 0
  let timer = 0

  const reset = () => {
    diverge = p.radians(GOLDEN + p.random(-0.7, 0.7))
    scale = (Math.min(p.width, p.height) * 0.45) / Math.sqrt(FLORETS)
    squash = p.random(0.86, 1)
    grown = 0
    phase = 0
    timer = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    reset()
  }

  p.draw = () => {
    p.background(pal.bg)
    if (phase === 0) {
      grown = Math.min(FLORETS, grown + 3.2)
      if (grown >= FLORETS) {
        phase = 1
        timer = 0
      }
    } else if (phase === 1) {
      if (++timer > 170) {
        phase = 2
        timer = 0
      }
    } else if (++timer > 80) {
      reset()
      return
    }
    const fade = phase === 2 ? 1 - timer / 80 : 1
    const n = Math.floor(grown)
    const rot = p.frameCount * 0.0018

    p.translate(p.width / 2, p.height / 2)

    const ring = p.color(pal.dim)
    ring.setAlpha(55 * fade)
    p.noFill()
    p.stroke(ring)
    p.strokeWeight(1)
    const rim = scale * Math.sqrt(FLORETS) + 8
    p.ellipse(0, 0, rim * 2, rim * 2 * squash)

    const petal = p.color(pal.signal)
    const bud = p.color(pal.accent)
    for (let i = 0; i < n; i++) {
      const a = i * diverge + rot
      const r = scale * Math.sqrt(i)
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r * squash
      const k = i / FLORETS
      const d = 1.4 + k * 3.6
      const young = n - i
      if (young < 70) {
        bud.setAlpha((200 - young * 2) * fade)
        p.stroke(bud)
        p.strokeWeight(1)
      } else {
        petal.setAlpha((70 + k * 110) * fade)
        p.stroke(petal)
        p.strokeWeight(0.9)
      }
      p.push()
      p.translate(x, y)
      p.rotate(a + p.HALF_PI)
      p.ellipse(0, 0, d, d * 2.1)
      p.pop()
    }

    const core = p.color(pal.signal)
    core.setAlpha(180 * fade)
    p.noStroke()
    p.fill(core)
    p.ellipse(0, 0, 3, 3)
  }
}
