import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Foam {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const foam: Foam[] = []
  const baseline = ctx.height * 0.68

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    const local = p.frameCount % 240
    if (local === 0) foam.length = 0
    const phase = local / 240
    const crestX = ctx.width * (0.27 + phase * 0.66)
    const amplitude = Math.sin(Math.min(1, phase / 0.72) * p.PI) * ctx.height * 0.25 + 18
    const width = ctx.width * (0.13 - phase * 0.045)
    p.background(ctx.palette.ink)

    const body = p.color(ctx.palette.dim)
    body.setAlpha(115)
    p.fill(body)
    p.noStroke()
    p.beginShape()
    p.vertex(0, ctx.height)
    for (let i = 0; i <= 72; i++) {
      const x = i * ctx.width / 72
      const scale = x < crestX ? width : width * 0.48
      const z = (x - crestX) / scale
      const y = baseline - Math.exp(-z * z) * amplitude + Math.sin(x * 0.035 + local * 0.04) * 3
      p.vertex(x, y)
    }
    p.vertex(ctx.width, ctx.height)
    p.endShape(p.CLOSE)

    p.noFill()
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.beginShape()
    for (let i = 0; i <= 72; i++) {
      const x = i * ctx.width / 72
      const scale = x < crestX ? width : width * 0.48
      const z = (x - crestX) / scale
      p.vertex(x, baseline - Math.exp(-z * z) * amplitude + Math.sin(x * 0.035 + local * 0.04) * 3)
    }
    p.endShape()

    if (local > 52 && local < 158) {
      const curl = amplitude * 0.34
      const curlX = crestX + width * 0.22
      const curlY = baseline - amplitude * 0.73
      p.stroke(ctx.palette.accent)
      p.strokeWeight(2.5)
      p.arc(curlX, curlY, curl * 1.7, curl * 1.25, -p.HALF_PI, p.PI * 1.25)
      for (let i = 0; i < 3 && foam.length < 220; i++) {
        foam.push({ x: curlX + p.random(-curl * 0.4, curl * 0.4), y: curlY + p.random(-8, 8), vx: p.random(0.5, 2.2), vy: p.random(-2.8, -0.4), life: p.random(35, 90) })
      }
    }

    p.noStroke()
    for (let i = foam.length - 1; i >= 0; i--) {
      const bead = foam[i]
      bead.vy += 0.06
      bead.x += bead.vx
      bead.y += bead.vy
      bead.life--
      const color = p.color(i % 11 === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(Math.min(210, bead.life * 5))
      p.fill(color)
      p.circle(bead.x, bead.y, 2.8)
      if (bead.life <= 0) foam.splice(i, 1)
    }
    if (phase > 0.68) {
      p.stroke(ctx.palette.signal)
      p.strokeWeight(1.2)
      for (let i = 0; i < 9; i++) {
        const y = baseline + 18 + i * 9
        const x = ctx.width * (0.88 - (phase - 0.68) * 0.6) - i * 16
        p.line(x, y, x - 35, y)
      }
    }
  }
}
