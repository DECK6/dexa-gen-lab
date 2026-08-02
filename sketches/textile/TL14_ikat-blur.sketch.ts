import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const WARPS = 49

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.strokeCap(p.SQUARE)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const gap = p.width / WARPS
    const t = p.frameCount * 0.012
    const drift = (p.frameCount * 0.18) % 150
    const baseWarp = p.color(ctx.palette.dim)
    baseWarp.setAlpha(65)
    p.stroke(baseWarp)
    p.strokeWeight(1)
    for (let col = 0; col <= WARPS; col++) p.line((col + 0.5) * gap, 0, (col + 0.5) * gap, p.height)

    for (let col = 0; col < WARPS; col++) {
      const x = (col + 0.5) * gap
      const folded = Math.abs(((col + 6) % 12) - 6) / 6
      const halfHeight = (1 - folded) * 68 + 4
      const misregister = (p.noise(col * 0.19, t * 0.17) - 0.5) * 22
      for (let band = -2; band < 6; band++) {
        const centerY = band * 150 + drift + ((Math.floor(col / 12) % 2) * 75)
        for (let ghost = -2; ghost <= 2; ghost++) {
          const dye = p.color(ghost === 0 ? ctx.palette.signal : ctx.palette.dim)
          dye.setAlpha(ghost === 0 ? 210 : 42)
          p.stroke(dye)
          p.strokeWeight(ghost === 0 ? 3.2 : 2)
          const smear = ghost * (5 + 4 * Math.sin(t + col))
          p.line(x + misregister, centerY - halfHeight + smear, x + misregister, centerY + halfHeight + smear)
        }
      }
    }

    const marker = p.color(ctx.palette.accent)
    marker.setAlpha(210)
    p.stroke(marker)
    p.strokeWeight(2)
    for (let col = 6; col < WARPS; col += 24) {
      const y = (drift + Math.floor(col / 12) * 75) % p.height
      p.line(col * gap - 5, y, col * gap + 5, y)
    }
  }
}
