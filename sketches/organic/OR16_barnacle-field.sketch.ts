import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 34

type Barnacle = { x: number; y: number; r: number; phase: number; rate: number; sides: number; hot: boolean }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const colony: Barnacle[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < COUNT; i++) {
      const row = Math.floor(i / 7)
      const col = i % 7
      colony.push({
        x: p.width * (0.12 + col * 0.125 + (row % 2) * 0.055) + p.random(-12, 12),
        y: p.height * (0.2 + row * 0.15) + p.random(-12, 12),
        r: p.random(p.width * 0.026, p.width * 0.052),
        phase: p.random(p.TWO_PI),
        rate: p.random(0.025, 0.055),
        sides: Math.floor(p.random(6, 9)),
        hot: p.random() < 0.12,
      })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const shell = p.color(pal.signal)
    const seam = p.color(pal.dim)
    const hot = p.color(pal.accent)
    for (const b of colony) {
      const open = Math.pow(0.5 + 0.5 * Math.sin(p.frameCount * b.rate + b.phase), 1.7)
      p.push()
      p.translate(b.x, b.y)
      p.noFill()
      shell.setAlpha(145)
      p.stroke(shell)
      p.strokeWeight(1.3)
      p.beginShape()
      for (let i = 0; i < b.sides; i++) {
        const a = (i / b.sides) * p.TWO_PI
        const r = b.r * (0.88 + 0.12 * Math.sin(i * 4.1 + b.phase))
        p.vertex(Math.cos(a) * r, Math.sin(a) * r)
      }
      p.endShape(p.CLOSE)
      seam.setAlpha(100)
      p.stroke(seam)
      p.ellipse(0, 0, b.r * 1.15, b.r * 0.62)
      for (let i = 0; i < b.sides; i += 2) {
        const a = (i / b.sides) * p.TWO_PI
        p.line(Math.cos(a) * b.r * 0.58, Math.sin(a) * b.r * 0.31, Math.cos(a) * b.r * 0.92, Math.sin(a) * b.r * 0.92)
      }
      const tentacle = b.hot ? hot : shell
      tentacle.setAlpha(110 + open * 120)
      p.stroke(tentacle)
      p.strokeWeight(1)
      for (let i = -3; i <= 3; i++) {
        const a = -p.HALF_PI + i * 0.12 * open
        const len = b.r * (0.22 + open * (0.75 - Math.abs(i) * 0.05))
        p.line(i * b.r * 0.06, 0, Math.cos(a) * len, Math.sin(a) * len)
      }
      p.pop()
    }
  }
}
