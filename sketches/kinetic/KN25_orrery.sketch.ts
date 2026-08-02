import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

function gear(p: P5, x: number, y: number, radius: number, teeth: number, angle: number): void {
  p.beginShape()
  for (let i = 0; i < teeth * 2; i++) {
    const a = angle + (i * p.PI) / teeth
    const r = i % 2 === 0 ? radius : radius * 0.84
    p.vertex(x + Math.cos(a) * r, y + Math.sin(a) * r)
  }
  p.endShape(p.CLOSE)
}

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const size = Math.min(ctx.width, ctx.height)
    const cx = ctx.width * 0.5
    const cy = ctx.height * 0.48
    const drive = p.frameCount * 0.032
    const radii = [size * 0.16, size * 0.27, size * 0.39]
    const ratios = [1.6, 3.4, 6.2]
    const planets = [size * 0.024, size * 0.032, size * 0.041]
    p.noFill()
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    for (const radius of radii) {
      p.circle(cx, cy, radius * 2)
      for (let i = 0; i < 24; i++) {
        const angle = (i * p.TWO_PI) / 24
        p.point(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
      }
    }
    p.stroke(ctx.palette.signal)
    p.strokeWeight(2)
    p.fill(ctx.palette.ink)
    gear(p, cx, cy, size * 0.055, 18, drive)
    for (let i = 0; i < radii.length; i++) {
      const orbitAngle = drive / ratios[i]! + i * 2.1
      const radius = radii[i]!
      const planetX = cx + Math.cos(orbitAngle) * radius
      const planetY = cy + Math.sin(orbitAngle) * radius
      const idlerX = cx + Math.cos(orbitAngle) * radius * 0.48
      const idlerY = cy + Math.sin(orbitAngle) * radius * 0.48
      p.stroke(ctx.palette.signal)
      p.strokeWeight(3)
      p.line(cx, cy, planetX, planetY)
      p.fill(ctx.palette.ink)
      p.stroke(ctx.palette.paper)
      p.strokeWeight(2)
      gear(p, idlerX, idlerY, size * (0.025 + i * 0.006), 10 + i * 2, -drive * (1.7 + i * 0.35))
      p.stroke(ctx.palette.signal)
      gear(p, planetX, planetY, planets[i]!, 12 + i * 2, -drive * ratios[i]!)
      p.noStroke()
      p.fill(i === 1 ? ctx.palette.accent : ctx.palette.paper)
      p.circle(planetX, planetY, planets[i]! * 0.85)
    }
    p.noStroke()
    p.fill(ctx.palette.accent)
    p.circle(cx, cy, size * 0.035)
    p.stroke(ctx.palette.paper)
    p.strokeWeight(2)
    p.line(cx, cy + radii[2]! + 18, cx, cy + radii[2]! + size * 0.08)
  }
}
