import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

type BreakerState = 'CLOSED' | 'OPEN' | 'HALF'

export function sketch(p: P5, ctx: SketchCtx): void {
  let state: BreakerState = 'CLOSED'
  let stateFrame = 0
  let overload = 0
  const history: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const cycle = p.frameCount % 240
    const spike = cycle > 34 && cycle < 82 ? 0.58 : 0
    const demand = 0.42 + Math.sin(p.frameCount * 0.071) * 0.18 + spike
    const carried = state === 'OPEN' ? 0 : state === 'HALF' ? demand * 0.28 : demand
    stateFrame++
    if (state === 'CLOSED') {
      overload = demand > 0.83 ? overload + 1 : Math.max(0, overload - 2)
      if (overload > 8) { state = 'OPEN'; stateFrame = 0; overload = 0 }
    } else if (state === 'OPEN' && stateFrame > 54) {
      state = 'HALF'; stateFrame = 0
    } else if (state === 'HALF' && stateFrame > 24) {
      state = demand < 0.72 ? 'CLOSED' : 'OPEN'; stateFrame = 0
    }
    history.push(carried)
    if (history.length > 125) history.shift()

    const cx = p.width / 2
    p.noFill(); p.stroke(ctx.palette.dim); p.strokeWeight(18); p.arc(cx, 235, 270, 270, Math.PI, p.TWO_PI)
    p.stroke(demand > 0.83 ? ctx.palette.accent : ctx.palette.signal)
    p.arc(cx, 235, 270, 270, Math.PI, Math.PI + p.constrain(demand, 0, 1.2) / 1.2 * Math.PI)
    const angle = Math.PI + p.constrain(demand, 0, 1.2) / 1.2 * Math.PI
    p.stroke(ctx.palette.paper); p.strokeWeight(3); p.line(cx, 235, cx + Math.cos(angle) * 110, 235 + Math.sin(angle) * 110)
    const states: BreakerState[] = ['CLOSED', 'OPEN', 'HALF']
    for (let i = 0; i < states.length; i++) {
      const x = 180 + i * 140
      p.noStroke(); p.fill(states[i] === state ? (state === 'OPEN' ? ctx.palette.accent : ctx.palette.signal) : ctx.palette.bg)
      p.rect(x - 55, 310, 110, 42, 3)
      p.fill(states[i] === state ? ctx.palette.ink : ctx.palette.dim); p.textAlign(p.CENTER); p.textSize(11); p.text(states[i]!, x, 336)
    }
    p.noFill(); p.stroke(ctx.palette.signal); p.strokeWeight(1.5); p.beginShape()
    for (let i = 0; i < history.length; i++) p.vertex(48 + i * 4.35, 555 - history[i]! * 135)
    p.endShape()
    p.stroke(ctx.palette.accent); p.line(48, 555 - 0.83 * 135, 592, 555 - 0.83 * 135)
  }
}
