import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const GILLS = 54
const RADIAL_STEPS = 18

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let rotation = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    rotation = p.random(p.TWO_PI)
  }

  p.draw = () => {
    p.background(pal.bg)
    const radius = p.width * 0.39
    const pulse = 0.45 + 0.55 * Math.sin(p.frameCount * 0.024) ** 2
    p.push()
    p.translate(p.width / 2, p.height / 2)
    p.scale(1, 0.72)
    const rim = p.color(pal.dim)
    rim.setAlpha(110)
    p.noFill()
    p.stroke(rim)
    p.strokeWeight(1)
    p.ellipse(0, 0, radius * 2)
    const gill = p.color(pal.signal)
    const hot = p.color(pal.accent)
    for (let i = 0; i < GILLS; i++) {
      const base = rotation + (i / GILLS) * p.TWO_PI
      const ridge = (i % 2 === 0 ? 1 : -1) * pulse
      const col = i % 13 === 0 ? hot : gill
      col.setAlpha(i % 13 === 0 ? 190 : 80 + 80 * Math.cos(base) ** 2)
      p.stroke(col)
      p.strokeWeight(i % 13 === 0 ? 1.6 : 0.9)
      p.beginShape()
      for (let j = 1; j <= RADIAL_STEPS; j++) {
        const u = j / RADIAL_STEPS
        const fold = ridge * Math.sin(u * p.PI) * 0.045
        const a = base + fold + Math.sin(p.frameCount * 0.018 + i) * 0.006 * u
        const r = radius * (0.08 + u * 0.92)
        p.vertex(Math.cos(a) * r, Math.sin(a) * r)
      }
      p.endShape()
    }
    for (let ring = 1; ring <= 4; ring++) {
      rim.setAlpha(28 + ring * 8)
      p.stroke(rim)
      p.ellipse(0, 0, radius * ring * 0.4)
    }
    hot.setAlpha(210)
    p.noStroke()
    p.fill(hot)
    p.ellipse(0, 0, 9 + pulse * 5)
    p.pop()
  }
}
