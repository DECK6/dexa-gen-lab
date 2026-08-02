import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Sample {
  value: number
  expected: number
  anomaly: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const data: Sample[] = []
  const count = 96
  let sampleIndex = 0

  const sample = (n: number): Sample => {
    const expected = Math.sin(n * 0.075) * 0.34 + Math.sin(n * 0.021) * 0.18
    const anomaly = ((n % 47) + 47) % 47 < 2
    const noise = (p.noise(n * 0.11) - 0.5) * 0.18
    return { value: expected + noise + (anomaly ? Math.sin(n * 1.9) * 0.8 : 0), expected, anomaly }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = -count; i < 0; i++) data.push(sample(i))
  }

  p.draw = () => {
    if (p.frameCount % 3 === 0) {
      data.shift()
      data.push(sample(sampleIndex++))
    }
    p.background(pal.bg)
    const margin = 38
    const top = 86
    const bottom = ctx.height - 72
    const width = ctx.width - margin * 2
    const yOf = (value: number): number => p.map(value, -1.3, 1.3, bottom, top)
    const band = 0.22
    const zone = p.color(pal.signal)
    zone.setAlpha(28)
    p.noStroke()
    p.fill(zone)
    p.beginShape()
    for (let i = 0; i < count; i++) p.vertex(margin + i * width / (count - 1), yOf(data[i].expected + band))
    for (let i = count - 1; i >= 0; i--) p.vertex(margin + i * width / (count - 1), yOf(data[i].expected - band))
    p.endShape(p.CLOSE)
    p.noFill()
    p.stroke(pal.signal)
    p.strokeWeight(1.5)
    p.beginShape()
    for (let i = 0; i < count; i++) p.vertex(margin + i * width / (count - 1), yOf(data[i].value))
    p.endShape()
    const scanX = margin + (p.frameCount % 120) / 119 * width
    p.stroke(pal.paper)
    p.strokeWeight(1)
    p.line(scanX, top - 18, scanX, bottom + 18)
    for (let i = 0; i < count; i++) {
      if (!data[i].anomaly) continue
      const x = margin + i * width / (count - 1)
      const detected = x <= scanX && scanX - x < width * 0.42
      p.noFill()
      p.stroke(detected ? pal.accent : pal.dim)
      p.strokeWeight(detected ? 2 : 1)
      p.circle(x, yOf(data[i].value), detected ? 15 : 7)
    }
    p.noStroke()
    p.fill(pal.accent)
    p.rect(scanX - 3, top - 25, 6, 6)
  }
}
