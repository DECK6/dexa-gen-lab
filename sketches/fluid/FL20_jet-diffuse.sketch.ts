import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Parcel {
  x: number
  y: number
  vx: number
  vy: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const parcels: Parcel[] = []
  const nozzleX = ctx.width * 0.08
  const centerY = ctx.height * 0.5

  function reset(parcel: Parcel, scatter: boolean) {
    parcel.x = scatter ? p.random(nozzleX, ctx.width) : nozzleX + p.random(-8, 2)
    const spread = scatter ? 8 + (parcel.x - nozzleX) * 0.19 : 8
    const centered = (p.random() + p.random() + p.random()) / 3 - 0.5
    parcel.y = centerY + centered * spread * 2
    parcel.vx = p.random(1.2, 2.8)
    parcel.vy = p.random(-0.18, 0.18)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 780; i++) {
      const parcel = { x: 0, y: 0, vx: 0, vy: 0 }
      reset(parcel, true)
      parcels.push(parcel)
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const f = p.frameCount
    const plume = p.color(ctx.palette.signal)
    plume.setAlpha(105)
    p.stroke(plume)
    p.strokeWeight(1.1)
    for (const parcel of parcels) {
      const oldX = parcel.x
      const oldY = parcel.y
      const progress = Math.max(0, (parcel.x - nozzleX) / (ctx.width - nozzleX))
      const eddy = p.noise(parcel.x * 0.009, parcel.y * 0.012, f * 0.005) - 0.5
      const targetVx = 2.9 / (1 + progress * 1.8)
      parcel.vx += (targetVx - parcel.vx) * 0.045
      parcel.vy = parcel.vy * 0.94 + eddy * (0.12 + progress * 0.22)
      parcel.x += parcel.vx
      parcel.y += parcel.vy
      if (parcel.x > ctx.width + 5 || parcel.y < 0 || parcel.y > ctx.height) reset(parcel, false)
      else p.line(oldX, oldY, parcel.x, parcel.y)
    }

    const envelope = p.color(ctx.palette.dim)
    envelope.setAlpha(145)
    p.stroke(envelope)
    p.strokeWeight(1)
    for (let x = nozzleX + 20; x < ctx.width; x += 34) {
      const spread = 12 + (x - nozzleX) * 0.19
      p.line(x, centerY - spread, x + 18, centerY - spread - 4)
      p.line(x, centerY + spread, x + 18, centerY + spread + 4)
    }
    p.noStroke()
    p.fill(ctx.palette.ink)
    p.rect(0, centerY - 25, nozzleX, 50)
    p.stroke(ctx.palette.accent)
    p.strokeWeight(3)
    p.line(nozzleX, centerY - 25, nozzleX, centerY + 25)
    p.stroke(ctx.palette.signal)
    p.line(nozzleX, centerY, nozzleX + 32, centerY)
  }
}
