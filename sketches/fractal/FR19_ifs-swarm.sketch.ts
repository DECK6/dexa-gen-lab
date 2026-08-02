import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Affine {
  a: number
  b: number
  c: number
  d: number
  tx: number
  ty: number
}

const DUST = 2800
const MAPS = 4

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const maps: Affine[] = []
  let x = 0
  let y = 0
  let phase = 0

  const updateMaps = (t: number) => {
    for (let i = 0; i < MAPS; i++) {
      const scale = 0.4 + 0.035 * Math.sin(t * 0.7 + i * 1.9)
      const angle = (i % 2 === 0 ? 1 : -1) * (0.2 + 0.13 * Math.sin(t * 0.53 + i))
      const orbit = (i * p.TWO_PI) / MAPS + 0.2 * Math.sin(t * 0.41 + i * 1.7)
      maps[i] = {
        a: Math.cos(angle) * scale,
        b: Math.sin(angle) * scale,
        c: -Math.sin(angle) * scale,
        d: Math.cos(angle) * scale,
        tx: Math.cos(orbit) * 0.51,
        ty: Math.sin(orbit) * 0.51,
      }
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    phase = p.random(p.TWO_PI)
    updateMaps(phase)
    p.strokeWeight(1)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(19)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    updateMaps(phase + p.frameCount * 0.008)
    const cyan = p.color(pal.signal)
    cyan.setAlpha(58)
    const hot = p.color(pal.accent)
    hot.setAlpha(150)
    const scale = Math.min(p.width, p.height) * 0.43
    p.strokeWeight(1)

    for (let i = 0; i < DUST; i++) {
      const m = maps[Math.floor(p.random(MAPS))]!
      const nx = m.a * x + m.c * y + m.tx
      y = m.b * x + m.d * y + m.ty
      x = nx
      p.stroke(i % 257 === 0 ? hot : cyan)
      p.point(p.width / 2 + x * scale, p.height / 2 + y * scale)
    }
  }
}
