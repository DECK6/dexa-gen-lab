import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const charts: number[][] = []
  const cols = 4
  const rows = 5
  const samples = 24

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.textFont('monospace')
    for (let i = 0; i < cols * rows; i++) {
      const chart: number[] = []
      for (let j = 0; j < samples; j++) chart.push(p.noise(i * 0.7, j * 0.12))
      charts.push(chart)
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const margin = 28
    const gap = 9
    const cellW = (ctx.width - margin * 2 - gap * (cols - 1)) / cols
    const cellH = (ctx.height - margin * 2 - gap * (rows - 1)) / rows
    for (let i = 0; i < charts.length; i++) {
      if ((p.frameCount + i * 3) % (2 + i % 5) === 0) {
        charts[i].shift()
        const wave = Math.sin(p.frameCount * (0.025 + i * 0.0008) + i) * 0.24
        charts[i].push(p.constrain(p.noise(i * 0.31, p.frameCount * 0.018) * 0.82 + wave, 0.04, 0.98))
      }
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = margin + col * (cellW + gap)
      const y = margin + row * (cellH + gap)
      p.stroke(pal.dim)
      p.strokeWeight(1)
      p.fill(pal.ink)
      p.rect(x, y, cellW, cellH, 2)
      p.noFill()
      const line = p.color(pal.signal)
      line.setAlpha(205)
      p.stroke(line)
      p.strokeWeight(1.5)
      p.beginShape()
      for (let j = 0; j < samples; j++) {
        const px = x + 7 + j * (cellW - 14) / (samples - 1)
        const py = y + cellH - 8 - charts[i][j] * (cellH - 22)
        p.vertex(px, py)
      }
      p.endShape()
      const latest = charts[i][samples - 1]
      p.noStroke()
      p.fill(latest > 0.78 ? pal.accent : pal.paper)
      p.circle(x + cellW - 7, y + cellH - 8 - latest * (cellH - 22), 4)
      p.fill(pal.dim)
      p.textSize(8)
      p.text(`C${String(i + 1).padStart(2, '0')}`, x + 6, y + 11)
    }
  }
}
