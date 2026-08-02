import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const channels = 8
  const samples = 112
  const waves: number[][] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.textFont('monospace')
    for (let channel = 0; channel < channels; channel++) {
      const wave: number[] = []
      for (let i = 0; i < samples; i++) wave.push((p.noise(channel, i * 0.06) - 0.5) * 0.7)
      waves.push(wave)
    }
  }

  p.draw = () => {
    const t = p.frameCount
    for (let channel = 0; channel < channels; channel++) {
      waves[channel].shift()
      const carrier = Math.sin(t * (0.06 + channel * 0.008) + channel * 0.8) * (0.2 + channel * 0.035)
      const modulation = Math.sin(t * 0.011 + channel) * carrier
      const noise = (p.noise(channel * 0.7, t * 0.026) - 0.5) * 0.58
      waves[channel].push(p.constrain(carrier + modulation + noise, -0.95, 0.95))
    }
    p.background(pal.bg)
    const margin = 30
    const rackH = (ctx.height - margin * 2) / channels
    for (let channel = 0; channel < channels; channel++) {
      const top = margin + channel * rackH
      const mid = top + rackH / 2
      p.fill(pal.ink)
      p.stroke(pal.dim)
      p.strokeWeight(1)
      p.rect(margin, top + 3, ctx.width - margin * 2, rackH - 6)
      const axis = p.color(pal.dim)
      axis.setAlpha(100)
      p.stroke(axis)
      p.line(margin + 34, mid, ctx.width - margin - 7, mid)
      p.noFill()
      p.stroke(channel === 6 ? pal.accent : pal.signal)
      p.strokeWeight(channel === 6 ? 1.8 : 1.25)
      p.beginShape()
      for (let i = 0; i < samples; i++) {
        const x = p.map(i, 0, samples - 1, margin + 34, ctx.width - margin - 7)
        p.vertex(x, mid - waves[channel][i] * rackH * 0.38)
      }
      p.endShape()
      p.noStroke()
      p.fill(pal.paper)
      p.textSize(8)
      p.text(`CH${channel + 1}`, margin + 7, mid + 3)
      const latest = waves[channel][samples - 1]
      p.fill(Math.abs(latest) > 0.75 ? pal.accent : pal.paper)
      p.circle(ctx.width - margin - 7, mid - latest * rackH * 0.38, 4)
    }
  }
}
