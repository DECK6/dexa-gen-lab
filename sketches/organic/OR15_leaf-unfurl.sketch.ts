import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const STEPS = 56

type Pt = { x: number; y: number; nx: number; ny: number; w: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let tilt = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    tilt = p.random(-0.16, 0.16)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(pal.bg)
    const phase = ((p.frameCount + 45) % 360) / 360
    const open = 0.5 - 0.5 * Math.cos(phase * p.TWO_PI)
    const curl = (1 - open) * 0.31 + Math.max(0, phase - 0.65) * 0.22
    const pts: Pt[] = []
    let x = p.width * 0.49
    let y = p.height * 0.88
    let angle = -p.HALF_PI + tilt
    const step = p.height * 0.012

    for (let i = 0; i < STEPS; i++) {
      const u = i / (STEPS - 1)
      angle += curl * Math.pow(u, 1.7) - open * 0.004 * Math.sin(u * p.PI)
      x += Math.cos(angle) * step
      y += Math.sin(angle) * step
      const width = Math.sin(u * p.PI) * p.width * 0.17 * (0.22 + open * 0.78)
      pts.push({ x, y, nx: -Math.sin(angle), ny: Math.cos(angle), w: width })
    }

    const wash = p.color(pal.signal)
    const edge = p.color(pal.signal)
    wash.setAlpha(24)
    edge.setAlpha(190)
    p.fill(wash)
    p.stroke(edge)
    p.strokeWeight(1.5)
    p.beginShape()
    for (const q of pts) p.vertex(q.x + q.nx * q.w, q.y + q.ny * q.w)
    for (let i = pts.length - 1; i >= 0; i--) {
      const q = pts[i]!
      p.vertex(q.x - q.nx * q.w, q.y - q.ny * q.w)
    }
    p.endShape(p.CLOSE)

    const vein = p.color(pal.signal)
    vein.setAlpha(145)
    p.noFill()
    p.stroke(vein)
    p.strokeWeight(2)
    p.beginShape()
    for (const q of pts) p.vertex(q.x, q.y)
    p.endShape()
    p.strokeWeight(1)
    for (let i = 5; i < pts.length - 3; i += 5) {
      const q = pts[i]!
      const reach = q.w * (0.58 + open * 0.26)
      p.line(q.x, q.y, q.x + q.nx * reach, q.y + q.ny * reach)
      p.line(q.x, q.y, q.x - q.nx * reach, q.y - q.ny * reach)
    }
    const bud = p.color(pal.accent)
    bud.setAlpha(210)
    p.noStroke()
    p.fill(bud)
    const tip = pts[pts.length - 1]!
    p.ellipse(tip.x, tip.y, 4 + (1 - open) * 4)
  }
}
