import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const top = ctx.height * 0.1
    const bottom = ctx.height * 0.9
    const center = ctx.width * 0.39
    const halfWidth = ctx.width * 0.14
    const active = 1 + Math.floor(p.frameCount / 55) % 6
    const time = p.frameCount * 0.028
    const pressureAt = (position: number): number => {
      let pressure = 0
      for (let harmonic = 1; harmonic <= active; harmonic++) {
        pressure += Math.sin(harmonic * Math.PI * position) * Math.cos(harmonic * time) / harmonic
      }
      return pressure
    }

    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    for (let step = 0; step <= 32; step++) {
      const position = step / 32
      const y = p.lerp(top, bottom, position)
      const displacement = pressureAt(position) * halfWidth * 0.56
      p.line(center, y, center + displacement, y)
    }
    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2.5)
    p.beginShape()
    for (let step = 0; step <= 180; step++) {
      const position = step / 180
      p.vertex(center + pressureAt(position) * halfWidth * 0.56, p.lerp(top, bottom, position))
    }
    p.endShape()

    p.stroke(ctx.palette.paper)
    p.strokeWeight(3)
    p.line(center - halfWidth, top, center - halfWidth, bottom)
    p.line(center + halfWidth, top, center + halfWidth, bottom)
    p.line(center - halfWidth, bottom, center + halfWidth, bottom)
    p.strokeWeight(1)
    p.line(center - halfWidth, top, center + halfWidth, top)

    const ladderX = ctx.width * 0.68
    const ladderWidth = ctx.width * 0.2
    p.stroke(ctx.palette.dim)
    p.line(ladderX, top, ladderX, bottom)
    for (let harmonic = 1; harmonic <= 6; harmonic++) {
      const y = p.lerp(bottom, top, (harmonic - 0.5) / 6)
      p.stroke(harmonic === active ? ctx.palette.accent : harmonic < active ? ctx.palette.signal : ctx.palette.dim)
      p.strokeWeight(harmonic === active ? 4 : 2)
      const energy = 0.25 + Math.abs(Math.cos(harmonic * time)) * 0.75
      p.line(ladderX, y, ladderX + ladderWidth * energy, y)
      p.point(ladderX - 8, y)
    }
    p.fill(ctx.palette.accent)
    p.noStroke()
    p.circle(center, p.lerp(bottom, top, (active - 0.5) / 6), 7)
  }
}
