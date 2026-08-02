import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 1080

interface Parcel {
  x: number
  y: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const parcels: Parcel[] = []

  const core = (x: number, t: number) => p.height * 0.5 + Math.sin(x * 0.012 + t) * p.height * 0.16 + Math.sin(x * 0.027 - t * 0.6) * p.height * 0.045
  const slope = (x: number, t: number) => Math.cos(x * 0.012 + t) * p.height * 0.00192 + Math.cos(x * 0.027 - t * 0.6) * p.height * 0.001215
  const spawn = (parcel: Parcel, lead = 0) => {
    parcel.x = lead
    parcel.y = p.random(p.height)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      const parcel = { x: 0, y: 0 }
      spawn(parcel, p.random(p.width))
      parcels.push(parcel)
    }
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(18)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const t = p.frameCount * 0.008
    const width = p.height * 0.095
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    for (let i = 0; i < parcels.length; i++) {
      const parcel = parcels[i]!
      const x = parcel.x
      const y = parcel.y
      const d = y - core(x, t)
      const fast = Math.exp(-(d * d) / (2 * width * width))
      const ux = 0.45 + fast * 3.45
      const uy = slope(x, t) * ux - d * 0.0045 * fast
      parcel.x += ux
      parcel.y += uy
      cyan.setAlpha(20 + fast * 175)
      p.stroke(cyan)
      p.strokeWeight(0.55 + fast * 1.25)
      p.line(x, y, parcel.x, parcel.y)
      if (parcel.x > p.width + 5 || parcel.y < -15 || parcel.y > p.height + 15) spawn(parcel, -5)
    }

    orange.setAlpha(150)
    p.noFill()
    p.stroke(orange)
    p.strokeWeight(1.2)
    p.beginShape()
    for (let x = 0; x <= p.width; x += 12) p.vertex(x, core(x, t))
    p.endShape()
  }
}
