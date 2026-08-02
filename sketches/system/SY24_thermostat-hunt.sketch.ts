import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  let temperature = 18.2
  let actuator = 0
  let heating = true
  const temperatures: number[] = []
  const targets: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const target = 22 + Math.sin(p.frameCount * 0.008) * 1.15
    if (temperature < target - 0.65) heating = true
    if (temperature > target + 0.65) heating = false
    actuator += ((heating ? 1 : 0) - actuator) * 0.025
    temperature += (16 - temperature) * 0.0032 + actuator * 0.031
    temperatures.push(temperature); targets.push(target)
    if (temperatures.length > 145) { temperatures.shift(); targets.shift() }

    const cx = p.width / 2
    const cy = 225
    const min = 15
    const max = 29
    const angle = (value: number) => p.map(value, min, max, Math.PI * 0.78, Math.PI * 2.22)
    p.noFill(); p.stroke(ctx.palette.dim); p.strokeWeight(16); p.arc(cx, cy, 285, 285, Math.PI * 0.78, Math.PI * 2.22)
    p.stroke(ctx.palette.signal); p.arc(cx, cy, 285, 285, Math.PI * 0.78, angle(temperature))
    const ta = angle(target)
    p.stroke(ctx.palette.accent); p.strokeWeight(4)
    p.line(cx + Math.cos(ta) * 125, cy + Math.sin(ta) * 125, cx + Math.cos(ta) * 151, cy + Math.sin(ta) * 151)
    const needle = angle(temperature)
    p.stroke(ctx.palette.paper); p.line(cx, cy, cx + Math.cos(needle) * 108, cy + Math.sin(needle) * 108)
    p.noStroke(); p.fill(heating ? ctx.palette.accent : ctx.palette.dim); p.circle(cx, cy, 24 + actuator * 12)
    p.fill(ctx.palette.paper); p.textAlign(p.CENTER); p.textSize(18); p.text(`${temperature.toFixed(1)}°`, cx, cy + 67)
    p.textSize(10); p.text(heating ? 'RELAY ON / THERMAL LAG' : 'RELAY OFF / OVERSHOOT', cx, 350)

    const yOf = (value: number) => p.map(value, min, max, 570, 405)
    p.noFill(); p.stroke(ctx.palette.signal); p.strokeWeight(1.5); p.beginShape()
    for (let i = 0; i < temperatures.length; i++) p.vertex(45 + i * 3.8, yOf(temperatures[i]!))
    p.endShape(); p.stroke(ctx.palette.accent); p.beginShape()
    for (let i = 0; i < targets.length; i++) p.vertex(45 + i * 3.8, yOf(targets[i]!))
    p.endShape()
  }
}
