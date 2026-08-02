import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const ROWS = 14
const TEETH = 26
const TOTAL = ROWS * TEETH

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const bend = new Float32Array(TOTAL)
  const velocity = new Float32Array(TOTAL)
  const memory = new Float32Array(TOTAL)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(pal.bg)
    const cw = p.width / TEETH
    const rh = p.height / ROWS
    const length = rh * 0.62
    const z = p.frameCount * 0.002
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    const dim = p.color(pal.dim)

    for (let row = 0; row < ROWS; row++) {
      const baseY = (row + 0.82) * rh
      dim.setAlpha(70)
      p.stroke(dim)
      p.strokeWeight(1)
      p.line(0, baseY, p.width, baseY)
      for (let col = 0; col < TEETH; col++) {
        const i = row * TEETH + col
        const x = (col + 0.5) * cw
        const target = (p.noise(col * 0.12, row * 0.2, z) - 0.5) * 2.2
        const strain = target - memory[i]!
        if (Math.abs(strain) > 0.32) memory[i]! += strain * 0.028
        velocity[i] = (velocity[i]! + (memory[i]! + strain * 0.46 - bend[i]!) * 0.075) * 0.86
        bend[i]! += velocity[i]!

        const hot = i % 61 === 0
        const ink = hot ? orange : cyan
        ink.setAlpha(hot ? 205 : 115)
        p.noFill()
        p.stroke(ink)
        p.strokeWeight(hot ? 1.7 : 1)
        p.beginShape()
        for (let s = 0; s <= 5; s++) {
          const u = s / 5
          const a = bend[i]! * u * u
          p.vertex(x + Math.sin(a) * length * u, baseY - Math.cos(a) * length * u)
        }
        p.endShape()
      }
    }
  }
}
