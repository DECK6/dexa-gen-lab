import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const LANES = [
  { text: 'DEXA +12.40  GLYPH 084  SIGNAL 99.2  ', speed: -1.25 },
  { text: 'GEN LAB / LIVE INDEX / TX20 / ', speed: 0.82 },
  { text: 'INK 001  CYAN 231  ORANGE 090  ', speed: -2.05 },
  { text: 'FRAME STREAM  SEED LOCK  60 FPS  ', speed: 1.48 },
  { text: 'TYPE MARKET +07.5  ASCII +12.8  ', speed: -0.66 },
  { text: 'HORIZONTAL TELEMETRY / ONLINE / ', speed: 2.42 },
]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.LEFT, p.CENTER)
    p.noStroke()
  }

  p.draw = () => {
    p.background(pal.bg)
    const laneH = p.height * 0.115
    const top = p.height * 0.16

    for (let i = 0; i < LANES.length; i++) {
      const lane = LANES[i]!
      const y = top + i * laneH
      const band = p.color(i % 2 === 0 ? pal.ink : pal.dim)
      band.setAlpha(i % 2 === 0 ? 245 : 45)
      p.fill(band)
      p.rect(0, y - laneH * 0.45, p.width, laneH * 0.9)
      p.textSize(p.width * (0.025 + i * 0.0018))
      const span = p.textWidth(lane.text)
      const shift = ((p.frameCount * lane.speed) % span + span) % span
      const ink = p.color(i === 2 ? pal.accent : pal.signal)
      ink.setAlpha(145 + (i % 3) * 40)
      p.fill(ink)
      for (let x = -span + shift; x < p.width + span; x += span) p.text(lane.text, x, y)
    }

    const edge = p.color(pal.accent)
    edge.setAlpha(210)
    p.fill(edge)
    const marker = (p.frameCount * 2.1) % p.width
    p.rect(marker, p.height * 0.89, p.width * 0.035, 3)
  }
}
