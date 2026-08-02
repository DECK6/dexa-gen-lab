import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Lift { floor: number; target: number; door: number }
interface HallCall { floor: number; owner: number; age: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const lifts: Lift[] = []
  const calls: HallCall[] = []
  const floors = 15

  const dispatch = () => {
    for (let c = 0; c < calls.length; c++) {
      if (calls[c]!.owner >= 0) continue
      let best = 0
      let cost = Infinity
      for (let i = 0; i < lifts.length; i++) {
        const lift = lifts[i]!
        const busy = lift.target >= 0 ? 7 + Math.abs(lift.target - calls[c]!.floor) : 0
        const eta = Math.abs(lift.floor - calls[c]!.floor) + busy
        if (eta < cost) { cost = eta; best = i }
      }
      calls[c]!.owner = best
      if (lifts[best]!.target < 0) lifts[best]!.target = calls[c]!.floor
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < 4; i++) lifts.push({ floor: 2 + i * 3.5, target: -1, door: 0 })
    for (let i = 0; i < 7; i++) calls.push({ floor: p.floor(p.random(floors)), owner: -1, age: i * 8 })
    dispatch()
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    if (p.frameCount % 38 === 1) {
      calls.push({ floor: p.floor(p.random(floors)), owner: -1, age: 0 })
      dispatch()
    }
    for (let i = 0; i < calls.length; i++) calls[i]!.age++
    for (let i = 0; i < lifts.length; i++) {
      const lift = lifts[i]!
      if (lift.target >= 0) {
        const delta = lift.target - lift.floor
        lift.floor += p.constrain(delta, -0.11, 0.11)
        if (Math.abs(delta) < 0.12) {
          lift.floor = lift.target
          lift.door = 22
          for (let c = calls.length - 1; c >= 0; c--) if (calls[c]!.owner === i && calls[c]!.floor === lift.target) calls.splice(c, 1)
          lift.target = -1
          const next = calls.find((call) => call.owner === i)
          if (next) lift.target = next.floor
        }
      } else if (lift.door > 0) lift.door--
    }
    dispatch()

    const top = 42
    const bottom = p.height - 42
    const fy = (floor: number) => bottom - (floor / (floors - 1)) * (bottom - top)
    const line = p.color(ctx.palette.signal); line.setAlpha(55)
    p.stroke(line); p.strokeWeight(1)
    for (let f = 0; f < floors; f++) p.line(60, fy(f), p.width - 55, fy(f))
    for (let i = 0; i < lifts.length; i++) {
      const x = 132 + i * 108
      p.stroke(ctx.palette.dim); p.line(x, top, x, bottom)
      const lift = lifts[i]!
      if (lift.target >= 0) {
        const guide = p.color(ctx.palette.accent); guide.setAlpha(90)
        p.stroke(guide); p.line(x, fy(lift.floor), x, fy(lift.target))
      }
      p.noStroke(); p.fill(ctx.palette.signal)
      p.rect(x - 21, fy(lift.floor) - 11, 42, 22, 3)
      p.fill(ctx.palette.ink)
      const gap = lift.door > 0 ? 7 * Math.sin((lift.door / 22) * Math.PI) : 1
      p.rect(x - gap, fy(lift.floor) - 9, gap * 2, 18)
    }
    p.noStroke()
    for (const call of calls) {
      p.fill(call.age > 90 ? ctx.palette.accent : ctx.palette.paper)
      p.circle(74 + call.owner * 7, fy(call.floor), 6)
    }
  }
}
