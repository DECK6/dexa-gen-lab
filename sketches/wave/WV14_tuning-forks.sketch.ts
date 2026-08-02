import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const cycle = p.frameCount % 320
    const decay = 0.18 + 0.82 * Math.exp(-cycle / 210)
    const phases = [p.frameCount * 0.28, p.frameCount * 0.315]
    const centers = [ctx.width * 0.31, ctx.width * 0.69]
    const top = ctx.height * 0.18
    const shoulder = ctx.height * 0.56

    p.noFill()
    for (let fork = 0; fork < 2; fork++) {
      const displacement = Math.sin(phases[fork]) * decay * ctx.width * 0.014
      const cx = centers[fork]
      const tine = ctx.width * 0.035
      const resonance = p.color(ctx.palette.signal)
      resonance.setAlpha(48 + Math.abs(Math.sin(phases[fork])) * 90)
      p.stroke(resonance)
      p.strokeWeight(1)
      for (let arc = 1; arc <= 3; arc++) {
        p.arc(cx, top + 35, 60 + arc * 35, 90 + arc * 42, -2.55, -0.59)
      }
      p.stroke(ctx.palette.signal)
      p.strokeWeight(5)
      p.line(cx - tine - displacement, top, cx - tine, shoulder)
      p.line(cx + tine + displacement, top, cx + tine, shoulder)
      p.arc(cx, shoulder - 8, tine * 2, 34, 0, Math.PI)
      p.line(cx, shoulder + 8, cx, shoulder + 72)
      p.stroke(ctx.palette.paper)
      p.strokeWeight(2)
      p.line(cx - 15, shoulder + 72, cx + 15, shoulder + 72)
    }

    const traceY = ctx.height * 0.83
    p.stroke(ctx.palette.dim)
    p.line(ctx.width * 0.08, traceY, ctx.width * 0.92, traceY)
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.beginShape()
    for (let x = 0; x <= 160; x++) {
      const frame = p.frameCount - 160 + x
      const beat = (Math.sin(frame * 0.28) + Math.sin(frame * 0.315)) * 12 * decay
      p.vertex(ctx.width * 0.08 + ctx.width * 0.84 * x / 160, traceY + beat)
    }
    p.endShape()
    p.fill(ctx.palette.accent)
    p.noStroke()
    p.circle(ctx.width * 0.5, traceY, 7 + Math.abs(Math.sin(p.frameCount * 0.0175)) * 6)
  }
}
