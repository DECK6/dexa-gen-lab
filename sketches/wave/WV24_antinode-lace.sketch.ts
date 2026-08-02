import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MODES = [[3, 4], [5, 2], [4, 7]] as const

function rectangularMode(x: number, y: number, horizontal: number, vertical: number): number {
  return Math.sin(horizontal * Math.PI * x) * Math.sin(vertical * Math.PI * y)
}

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const epoch = Math.floor(p.frameCount / 240)
    const local = p.frameCount % 240
    const blend = Math.max(0, (local - 180) / 60)
    const eased = blend * blend * (3 - 2 * blend)
    const modeA = MODES[epoch % MODES.length]
    const modeB = MODES[(epoch + 1) % MODES.length]
    const temporal = Math.cos(p.frameCount * 0.04)
    const left = ctx.width * 0.1
    const top = ctx.height * 0.1
    const width = ctx.width * 0.8
    const height = ctx.height * 0.8

    p.stroke(ctx.palette.signal)
    for (let row = 1; row < 40; row++) {
      for (let column = 1; column < 40; column++) {
        const x = column / 40
        const y = row / 40
        const a = rectangularMode(x, y, modeA[0], modeA[1])
        const b = rectangularMode(x, y, modeB[0], modeB[1])
        const spatial = p.lerp(a, b, eased)
        if (Math.abs(spatial) > 0.16) {
          const displacement = spatial * temporal
          p.strokeWeight(0.65 + Math.abs(displacement) * 3.2)
          p.point(left + x * width + displacement * 3, top + y * height - displacement * 3)
        }
      }
    }

    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    for (let node = 1; node < modeA[0]; node++) p.line(left + width * node / modeA[0], top, left + width * node / modeA[0], top + height)
    for (let node = 1; node < modeA[1]; node++) p.line(left, top + height * node / modeA[1], left + width, top + height * node / modeA[1])
    p.noFill()
    p.stroke(ctx.palette.paper)
    p.strokeWeight(2)
    p.rect(left, top, width, height)
    p.fill(ctx.palette.accent)
    p.noStroke()
    p.circle(left + width / (modeA[0] * 2), top + height / (modeA[1] * 2), 7)
  }
}
