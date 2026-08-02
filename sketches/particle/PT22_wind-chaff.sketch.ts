import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 360

interface Chaff {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const chaff: Chaff[] = []

  const reset = (o: Chaff, anywhere: boolean) => {
    o.x = p.random(p.width)
    o.y = anywhere ? p.random(p.height) : p.height + p.random(4, 50)
    o.vx = p.random(-0.3, 0.3)
    o.vy = p.random(-0.5, 0.1)
    o.angle = p.random(p.TWO_PI)
    o.hot = p.random() < 0.035
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      const o: Chaff = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, hot: false }
      reset(o, true)
      chaff.push(o)
    }
  }

  p.draw = () => {
    const cycle = p.frameCount % 300
    const gust = Math.max(0, Math.sin((cycle / 150) * Math.PI)) ** 3
    const direction = Math.floor(p.frameCount / 300) % 2 === 0 ? 1 : -1
    const veil = p.color(pal.bg)
    veil.setAlpha(30)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cyan = p.color(pal.signal)
    cyan.setAlpha(135)
    const orange = p.color(pal.accent)
    orange.setAlpha(205)
    p.strokeWeight(1)
    for (let i = 0; i < chaff.length; i++) {
      const o = chaff[i]
      const eddy = p.noise(o.x * 0.004, o.y * 0.004, p.frameCount * 0.004) - 0.5
      o.vx = o.vx * 0.96 + direction * gust * 0.19 + eddy * 0.06
      o.vy = o.vy * 0.97 + 0.035 - gust * (0.09 + p.noise(i) * 0.08)
      o.x += o.vx
      o.y += o.vy
      o.angle += o.vx * 0.08 + 0.02
      if (o.x < -20) o.x = p.width + 20
      if (o.x > p.width + 20) o.x = -20
      if (o.y < -30 || o.y > p.height + 55) reset(o, false)
      const dx = Math.cos(o.angle) * (2 + gust * 3)
      const dy = Math.sin(o.angle) * (2 + gust * 3)
      p.stroke(o.hot ? orange : cyan)
      p.line(o.x - dx, o.y - dy, o.x + dx, o.y + dy)
    }

    const meter = p.color(pal.accent)
    meter.setAlpha(180)
    p.stroke(meter)
    p.line(p.width * 0.08, p.height * 0.93, p.width * (0.08 + gust * 0.23), p.height * 0.93)
  }
}
