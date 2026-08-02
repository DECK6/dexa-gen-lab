import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const values: number[] = []
  const velocities: number[] = []
  const phases: number[] = []
  const count = 9

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.textFont('monospace')
    for (let i = 0; i < count; i++) {
      values.push(p.random(-0.7, 0.7))
      velocities.push(0)
      phases.push(p.random(p.TWO_PI))
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.018
    const nextVelocity: number[] = []
    for (let i = 0; i < count; i++) {
      let sum = 0
      let neighbours = 0
      const row = Math.floor(i / 3)
      const col = i % 3
      if (col > 0) { sum += values[i - 1]; neighbours++ }
      if (col < 2) { sum += values[i + 1]; neighbours++ }
      if (row > 0) { sum += values[i - 3]; neighbours++ }
      if (row < 2) { sum += values[i + 3]; neighbours++ }
      const drive = Math.sin(t * (0.82 + i * 0.015) + phases[i]) * 0.018
      const coupling = (sum / neighbours - values[i]) * 0.026
      nextVelocity.push((velocities[i] + drive + coupling - values[i] * 0.012) * 0.94)
    }
    const cellW = ctx.width / 3
    const cellH = ctx.height / 3
    for (let i = 0; i < count; i++) {
      velocities[i] = nextVelocity[i]
      values[i] = p.constrain(values[i] + velocities[i], -1, 1)
      const cx = (i % 3 + 0.5) * cellW
      const cy = (Math.floor(i / 3) + 0.61) * cellH
      const radius = Math.min(cellW, cellH) * 0.36
      p.noFill()
      p.stroke(pal.dim)
      p.strokeWeight(2)
      p.arc(cx, cy, radius * 2, radius * 2, p.PI, p.TWO_PI)
      for (let tick = 0; tick <= 8; tick++) {
        const angle = p.PI + tick * p.PI / 8
        p.stroke(tick === 7 ? pal.accent : pal.signal)
        p.strokeWeight(tick === 7 ? 2 : 1)
        p.line(cx + Math.cos(angle) * radius * 0.8, cy + Math.sin(angle) * radius * 0.8,
          cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
      }
      const angle = p.map(values[i], -1, 1, p.PI, p.TWO_PI)
      p.stroke(values[i] > 0.72 ? pal.accent : pal.paper)
      p.strokeWeight(2.5)
      p.line(cx, cy, cx + Math.cos(angle) * radius * 0.72, cy + Math.sin(angle) * radius * 0.72)
      p.noStroke()
      p.fill(pal.signal)
      p.circle(cx, cy, 7)
      p.fill(pal.dim)
      p.textSize(8)
      p.text(`G${i + 1}`, cx - radius, cy + 15)
    }
  }
}
