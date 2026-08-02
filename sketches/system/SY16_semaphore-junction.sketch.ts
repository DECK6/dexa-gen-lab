import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Car { dir: number; pos: number; speed: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const cars: Car[] = []
  const center = ctx.width / 2

  const addCar = (dir: number, pos = p.random(0, ctx.width)) => cars.push({ dir, pos, speed: p.random(1.2, 2.15) })

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < 34; i++) addCar(i % 4, (i * 73) % ctx.width)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const cycle = p.frameCount % 144
    const horizontalGreen = cycle < 62
    const verticalGreen = cycle >= 72 && cycle < 134
    if (p.frameCount % 28 === 0 && cars.length < 54) addCar(p.floor(p.random(4)), 0)
    for (const car of cars) {
      let velocity = car.speed
      const green = car.dir < 2 ? horizontalGreen : verticalGreen
      if (!green && car.pos < center - 48 && car.pos + velocity >= center - 48) velocity = 0
      let gap = Infinity
      for (const other of cars) if (other !== car && other.dir === car.dir) {
        const d = (other.pos - car.pos + p.width) % p.width
        if (d > 0) gap = Math.min(gap, d)
      }
      if (gap < 23) velocity = Math.max(0, (gap - 13) * 0.12)
      car.pos = (car.pos + velocity) % p.width
    }

    p.noStroke(); p.fill(ctx.palette.bg)
    p.rect(0, center - 58, p.width, 116)
    p.rect(center - 58, 0, 116, p.height)
    const lane = p.color(ctx.palette.signal); lane.setAlpha(55)
    p.stroke(lane); p.strokeWeight(1)
    p.line(0, center, center - 60, center); p.line(center + 60, center, p.width, center)
    p.line(center, 0, center, center - 60); p.line(center, center + 60, center, p.height)
    p.stroke(ctx.palette.paper)
    p.line(center - 60, center - 58, center - 60, center + 58)
    p.line(center + 60, center - 58, center + 60, center + 58)
    p.line(center - 58, center - 60, center + 58, center - 60)
    p.line(center - 58, center + 60, center + 58, center + 60)
    p.noStroke()
    const lights = [
      [center - 73, center - 72, horizontalGreen],
      [center + 73, center + 72, horizontalGreen],
      [center + 72, center - 73, verticalGreen],
      [center - 72, center + 73, verticalGreen],
    ] as const
    for (const [x, y, green] of lights) { p.fill(green ? ctx.palette.signal : ctx.palette.accent); p.circle(x, y, 11) }
    for (const car of cars) {
      let x = car.pos
      let y = center - 28
      if (car.dir === 1) { x = p.width - car.pos; y = center + 28 }
      if (car.dir === 2) { x = center + 28; y = car.pos }
      if (car.dir === 3) { x = center - 28; y = p.height - car.pos }
      p.push(); p.translate(x, y); p.rotate(car.dir * p.HALF_PI)
      p.fill(car.pos > center - 60 && car.pos < center + 60 ? ctx.palette.accent : ctx.palette.signal)
      p.rect(-9, -4, 18, 8, 2); p.pop()
    }
  }
}
