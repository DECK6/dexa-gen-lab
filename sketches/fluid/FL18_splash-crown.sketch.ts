import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  const jetScale: number[] = []
  const jetLean: number[] = []
  const jets = 14

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < jets; i++) {
      jetScale.push(p.random(0.78, 1.2))
      jetLean.push(p.random(-0.35, 0.35))
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const local = p.frameCount % 210
    const impact = 34
    const surfaceY = ctx.height * 0.7
    const water = p.color(ctx.palette.dim)
    water.setAlpha(90)
    p.noStroke()
    p.fill(water)
    p.rect(0, surfaceY, ctx.width, ctx.height - surfaceY)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(1.5)
    p.line(0, surfaceY, ctx.width, surfaceY)

    if (local < impact) {
      const fall = local / impact
      const y = ctx.height * 0.1 + fall * fall * (surfaceY - ctx.height * 0.1)
      p.noStroke()
      p.fill(ctx.palette.signal)
      p.ellipse(ctx.width * 0.5, y, 22, 29)
      p.stroke(ctx.palette.accent)
      p.line(ctx.width * 0.5, y - 34 - fall * 25, ctx.width * 0.5, y - 18)
      return
    }

    const elapsed = local - impact
    const q = Math.min(1, elapsed / 150)
    const crownHeight = Math.sin(q * p.PI) * ctx.height * 0.27
    const radius = ctx.width * (0.075 + 0.19 * (1 - Math.exp(-q * 3.5)))
    const baseY = surfaceY + q * ctx.height * 0.045
    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.ellipse(ctx.width * 0.5, baseY, radius * 2, radius * 0.55)

    for (let i = 0; i < jets; i++) {
      const angle = i * p.TWO_PI / jets
      const rimX = ctx.width * 0.5 + Math.cos(angle) * radius
      const rimY = baseY + Math.sin(angle) * radius * 0.275
      const perspective = 0.76 + Math.sin(angle) * 0.24
      const height = crownHeight * jetScale[i] * perspective
      const tipX = rimX + Math.cos(angle) * height * 0.22 + jetLean[i] * height * 0.18
      const tipY = rimY - height
      const color = p.color(i % 5 === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(195)
      p.stroke(color)
      p.strokeWeight(1.4 + perspective)
      p.line(rimX, rimY, tipX, tipY)
      p.noFill()
      p.circle(tipX, tipY, 4 + jetScale[i] * 4)
      const beadT = (elapsed * 0.025 + i * 0.19) % 1
      const beadX = tipX + Math.cos(angle) * beadT * 20
      const beadY = tipY - beadT * 24 + beadT * beadT * 46
      p.circle(beadX, beadY, 2.5)
    }

    const ripple = p.color(ctx.palette.signal)
    ripple.setAlpha(90)
    p.stroke(ripple)
    for (let i = 1; i < 4; i++) {
      const r = radius + i * 25 + q * 40
      p.ellipse(ctx.width * 0.5, surfaceY + 5, r * 2, r * 0.25)
    }
    if (q > 0.72) {
      p.stroke(ctx.palette.accent)
      const back = (q - 0.72) / 0.28
      for (let i = 0; i < 8; i++) {
        const x = ctx.width * (0.72 - i * 0.055 - back * 0.08)
        p.line(x, surfaceY + 25 + i * 3, x - 22, surfaceY + 25 + i * 3)
      }
    }
  }
}
