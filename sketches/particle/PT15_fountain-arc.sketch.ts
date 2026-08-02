import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 340
const GRAVITY = 0.16

interface Jet {
  x0: number
  vx: number
  vy: number
  age: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const jets: Jet[] = []
  let floorY = 0

  const launch = (o: Jet, initial = false) => {
    const left = p.random() < 0.5
    o.x0 = p.width * (left ? 0.28 : 0.72)
    o.vx = p.random(left ? 1.4 : -3.1, left ? 3.1 : -1.4)
    o.vy = p.random(-10.8, -7.2)
    o.age = initial ? p.random(0, 108) : 0
    o.hot = p.random() < 0.065
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    floorY = p.height * 0.84
    for (let i = 0; i < COUNT; i++) {
      const o: Jet = { x0: 0, vx: 0, vy: 0, age: 0, hot: false }
      launch(o, true)
      jets.push(o)
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(24)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cyan = p.color(pal.signal)
    cyan.setAlpha(125)
    const orange = p.color(pal.accent)
    orange.setAlpha(190)
    p.strokeWeight(1)
    for (let i = 0; i < jets.length; i++) {
      const o = jets[i]
      const x = o.x0 + o.vx * o.age
      const y = floorY + o.vy * o.age + GRAVITY * o.age * o.age * 0.5
      const nx = o.x0 + o.vx * (o.age + 1)
      const ny = floorY + o.vy * (o.age + 1) + GRAVITY * (o.age + 1) * (o.age + 1) * 0.5
      p.stroke(o.hot ? orange : cyan)
      p.line(x, y, nx, ny)
      o.age++
      if (ny >= floorY && o.age > 12) launch(o)
    }

    const deck = p.color(pal.dim)
    deck.setAlpha(150)
    p.stroke(deck)
    p.line(p.width * 0.1, floorY, p.width * 0.9, floorY)
    const nozzle = p.color(pal.accent)
    nozzle.setAlpha(200)
    p.stroke(nozzle)
    p.strokeWeight(3)
    p.point(p.width * 0.28, floorY)
    p.point(p.width * 0.72, floorY)
  }
}
