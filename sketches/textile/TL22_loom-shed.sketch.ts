import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const WARPS = 22

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const phase = (p.frameCount % 180) / 180
    const opening = phase < 0.28 ? phase / 0.28 : phase < 0.58 ? 1 : phase < 0.76 ? 1 - (phase - 0.58) / 0.18 : 0
    const shuttleProgress = Math.min(Math.max((phase - 0.28) / 0.3, 0), 1)
    const beatPhase = Math.min(Math.max((phase - 0.58) / 0.24, 0), 1)
    const beat = Math.sin(beatPhase * p.PI)
    const left = p.width * 0.13
    const right = p.width * 0.87
    const top = p.height * 0.12
    const bottom = p.height * 0.88
    const shedY = p.height * 0.53
    const shedHalf = p.height * 0.1 * opening

    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(10)
    p.rect(left - 20, top - 20, right - left + 40, bottom - top + 40)
    for (let index = 0; index < WARPS; index++) {
      const x = p.lerp(left, right, index / (WARPS - 1))
      const splitY = shedY + (index % 2 === 0 ? -shedHalf : shedHalf)
      const warp = p.color(index % 7 === 0 ? ctx.palette.paper : ctx.palette.signal)
      warp.setAlpha(index % 7 === 0 ? 120 : 165)
      p.stroke(warp)
      p.strokeWeight(1.4)
      p.line(x, top, x, splitY)
      p.line(x, splitY, x, bottom)
    }

    const shuttleX = p.lerp(left - 35, right + 35, shuttleProgress)
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.quad(shuttleX - 28, shedY, shuttleX, shedY - 10, shuttleX + 28, shedY, shuttleX, shedY + 10)
    p.stroke(ctx.palette.accent)
    p.strokeWeight(2)
    p.line(left, shedY, shuttleX, shedY)

    const reedY = top + p.height * 0.18 + beat * p.height * 0.2
    p.stroke(ctx.palette.paper)
    p.strokeWeight(5)
    p.line(left - 12, reedY, right + 12, reedY)
    p.strokeWeight(1)
    for (let index = 0; index < WARPS; index++) {
      const x = p.lerp(left, right, index / (WARPS - 1))
      p.line(x, reedY - 18, x, reedY + 18)
    }
  }
}
