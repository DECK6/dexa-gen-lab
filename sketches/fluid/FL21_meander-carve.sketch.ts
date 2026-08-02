import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const count = 92
  const channel: number[] = []
  const velocity: number[] = []
  const oxbow: number[] = []
  const oxbowStart = 34
  const mid = ctx.height * 0.5

  function restart() {
    channel.length = 0
    velocity.length = 0
    oxbow.length = 0
    for (let i = 0; i < count; i++) {
      const x = i / (count - 1)
      channel.push(mid + Math.sin(x * p.TWO_PI * 1.35) * ctx.height * 0.13 + Math.sin(x * p.TWO_PI * 3.1) * ctx.height * 0.025)
      velocity.push(0)
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    restart()
  }

  p.draw = () => {
    if (p.frameCount % 360 === 0) restart()
    const local = p.frameCount % 360
    const nextVelocity = velocity.slice()
    for (let i = 2; i < count - 2; i++) {
      const upstream = Math.max(1, i - 5)
      const delayedCurvature = channel[upstream - 1] - 2 * channel[upstream] + channel[upstream + 1]
      const localCurvature = channel[i - 1] - 2 * channel[i] + channel[i + 1]
      nextVelocity[i] = velocity[i] * 0.92 + delayedCurvature * 0.052 - localCurvature * 0.015 - (channel[i] - mid) * 0.00004
    }
    for (let i = 2; i < count - 2; i++) {
      velocity[i] = nextVelocity[i]
      channel[i] = Math.min(ctx.height * 0.82, Math.max(ctx.height * 0.18, channel[i] + velocity[i]))
    }
    if (local === 205) {
      for (let i = oxbowStart; i <= 58; i++) oxbow.push(channel[i])
      const startY = channel[oxbowStart]
      const endY = channel[58]
      for (let i = oxbowStart; i <= 58; i++) channel[i] = p.lerp(startY, endY, (i - oxbowStart) / (58 - oxbowStart))
    }

    p.background(ctx.palette.ink)
    p.noFill()
    if (oxbow.length > 0) {
      const oldWater = p.color(ctx.palette.accent)
      oldWater.setAlpha(120)
      p.stroke(oldWater)
      p.strokeWeight(7)
      p.beginShape()
      for (let i = 0; i < oxbow.length; i++) p.vertex((i + oxbowStart) * ctx.width / (count - 1), oxbow[i])
      p.endShape()
    }

    p.stroke(ctx.palette.dim)
    p.strokeWeight(18)
    p.beginShape()
    p.vertex(0, channel[0])
    for (let i = 0; i < count; i++) p.vertex(i * ctx.width / (count - 1), channel[i])
    p.vertex(ctx.width, channel[count - 1])
    p.endShape()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.beginShape()
    p.vertex(0, channel[0])
    let strongest = 2
    let strongestCurvature = 0
    for (let i = 0; i < count; i++) {
      p.vertex(i * ctx.width / (count - 1), channel[i])
      if (i > 0 && i < count - 1) {
        const curvature = Math.abs(channel[i - 1] - 2 * channel[i] + channel[i + 1])
        if (curvature > strongestCurvature) {
          strongest = i
          strongestCurvature = curvature
        }
      }
    }
    p.vertex(ctx.width, channel[count - 1])
    p.endShape()
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(strongest * ctx.width / (count - 1), channel[strongest], 7)
  }
}
