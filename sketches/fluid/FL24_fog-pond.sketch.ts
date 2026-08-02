import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Ribbon {
  y: number
  speed: number
  phase: number
  weight: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const ribbons: Ribbon[] = []
  const surface = ctx.height * 0.7

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 28; i++) {
      ribbons.push({
        y: p.random(ctx.height * 0.43, surface + 12),
        speed: p.random(0.12, 0.48),
        phase: p.random(100),
        weight: p.random(5, 17),
      })
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const f = p.frameCount
    const pond = p.color(ctx.palette.dim)
    pond.setAlpha(85)
    p.noStroke()
    p.fill(pond)
    p.ellipse(ctx.width * 0.5, surface + ctx.height * 0.1, ctx.width * 0.9, ctx.height * 0.3)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(1)
    p.line(ctx.width * 0.08, surface, ctx.width * 0.92, surface)

    p.noFill()
    p.strokeCap(p.ROUND)
    for (let i = 0; i < ribbons.length; i++) {
      const ribbon = ribbons[i]
      const fog = p.color(i % 9 === 0 ? ctx.palette.paper : ctx.palette.signal)
      fog.setAlpha(i % 9 === 0 ? 32 : 24 + ribbon.weight * 1.4)
      p.stroke(fog)
      p.strokeWeight(ribbon.weight)
      p.beginShape()
      for (let j = -2; j <= 22; j++) {
        const rawX = j * ctx.width / 20
        const x = rawX + Math.sin(f * 0.004 + ribbon.phase) * ctx.width * 0.04
        const lift = p.noise((rawX + f * ribbon.speed) * 0.004 + ribbon.phase, f * 0.003 + ribbon.phase) * ctx.height * 0.055
        const y = Math.min(surface + 18, ribbon.y - lift + Math.sin(j * 0.7 + f * 0.008 + ribbon.phase) * 5)
        p.vertex(x, y)
      }
      p.endShape()
    }
    const marker = ctx.width * (0.25 + (Math.sin(f * 0.009) + 1) * 0.25)
    p.stroke(ctx.palette.accent)
    p.strokeWeight(1.5)
    p.line(marker - 10, surface + 2, marker + 10, surface + 2)
  }
}
