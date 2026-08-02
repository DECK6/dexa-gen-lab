import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const CENTERS = 4
const COUNT = 920

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const owner: number[] = []
  const angle: number[] = []
  const radius: number[] = []
  const squash: number[] = []
  const speed: number[] = []
  const phase: number[] = []
  const cx = new Float32Array(CENTERS)
  const cy = new Float32Array(CENTERS)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      owner.push(i % CENTERS)
      angle.push(p.random(p.TWO_PI))
      radius.push(p.random(12, Math.min(p.width, p.height) * 0.15))
      squash.push(p.random(0.48, 0.92))
      speed.push(p.random(0.006, 0.024) * (i % 2 === 0 ? 1 : -1))
      phase.push(p.random(p.TWO_PI))
    }
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(24)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const t = p.frameCount * 0.004
    for (let k = 0; k < CENTERS; k++) {
      const col = k % 2
      const row = Math.floor(k / 2)
      cx[k] = p.width * (0.29 + col * 0.42) + Math.cos(t + k * 1.7) * 9
      cy[k] = p.height * (0.29 + row * 0.42) + Math.sin(t * 0.8 + k * 1.3) * 9
    }

    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    for (let i = 0; i < COUNT; i++) {
      const k = owner[i]!
      const a0 = angle[i]!
      const a1 = a0 + speed[i]!
      const wobble = 1 + Math.sin(t * 0.7 + phase[i]!) * 0.06
      const r = radius[i]! * wobble
      const x0 = cx[k]! + Math.cos(a0) * r
      const y0 = cy[k]! + Math.sin(a0) * r * squash[i]!
      const x1 = cx[k]! + Math.cos(a1) * r
      const y1 = cy[k]! + Math.sin(a1) * r * squash[i]!
      const col = i % 101 === 0 ? orange : cyan
      col.setAlpha(i % 101 === 0 ? 175 : 72)
      p.stroke(col)
      p.strokeWeight(i % 101 === 0 ? 1.6 : 0.85)
      p.line(x0, y0, x1, y1)
      angle[i] = a1
    }

    orange.setAlpha(170)
    p.stroke(orange)
    p.strokeWeight(1)
    for (let k = 0; k < CENTERS; k++) {
      p.line(cx[k]! - 5, cy[k]!, cx[k]! + 5, cy[k]!)
      p.line(cx[k]!, cy[k]! - 5, cx[k]!, cy[k]! + 5)
    }
  }
}
