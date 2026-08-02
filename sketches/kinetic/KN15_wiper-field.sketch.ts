import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const cellW = ctx.width / 3
    const cellH = ctx.height / 3
    const reach = size * 0.105
    const sweep = p.color(ctx.palette.signal)
    sweep.setAlpha(40)
    const ghost = p.color(ctx.palette.dim)
    ghost.setAlpha(110)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const index = row * 3 + col
        const x = (col + 0.5) * cellW
        const y = (row + 0.62) * cellH
        const phase = p.frameCount * 0.035 + index * 0.58
        const angle = -p.HALF_PI + Math.sin(phase) * 1.05
        p.noFill()
        p.stroke(ghost)
        p.strokeWeight(1)
        p.arc(x, y, reach * 2, reach * 2, -p.PI + 0.52, -0.52)
        p.stroke(sweep)
        p.strokeWeight(8)
        p.arc(x, y, reach * 1.7, reach * 1.7, angle - 0.16, angle + 0.16)
        p.stroke(ctx.palette.signal)
        p.strokeWeight(4)
        const tipX = x + Math.cos(angle) * reach
        const tipY = y + Math.sin(angle) * reach
        p.line(x, y, tipX, tipY)
        p.stroke(ctx.palette.paper)
        p.strokeWeight(2)
        const blade = reach * 0.42
        p.line(tipX - Math.sin(angle) * blade, tipY + Math.cos(angle) * blade, tipX + Math.sin(angle) * blade, tipY - Math.cos(angle) * blade)
        p.noStroke()
        p.fill(index % 4 === 0 ? ctx.palette.accent : ctx.palette.paper)
        p.circle(x, y, 9)
      }
    }
  }
}
