import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface CensusDot {
  home: number
  destination: number
  ax: number
  ay: number
  bx: number
  by: number
  phase: number
  size: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const centers = [[0.23, 0.25], [0.57, 0.2], [0.79, 0.43], [0.6, 0.73], [0.25, 0.68]]
  const dots: CensusDot[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let i = 0; i < 520; i++) {
      const home = i % centers.length
      const destination = (home + 1 + Math.floor(p.random(centers.length - 1))) % centers.length
      const angleA = p.random(p.TWO_PI)
      const angleB = p.random(p.TWO_PI)
      const radiusA = Math.sqrt(p.random()) * 58
      const radiusB = Math.sqrt(p.random()) * 58
      dots.push({ home, destination, ax: Math.cos(angleA) * radiusA, ay: Math.sin(angleA) * radiusA,
        bx: Math.cos(angleB) * radiusB, by: Math.sin(angleB) * radiusB, phase: p.random(), size: p.random(2.2, 4.5) })
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const contour = p.color(pal.dim)
    contour.setAlpha(110)
    p.noFill()
    p.stroke(contour)
    p.strokeWeight(1)
    for (let i = 0; i < centers.length; i++) {
      const center = centers[i]
      p.ellipse(center[0] * ctx.width, center[1] * ctx.height, 150 + i * 9, 126 + (i % 2) * 22)
      p.circle(center[0] * ctx.width, center[1] * ctx.height, 8)
    }
    p.noStroke()
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i]
      const u = (p.frameCount * 0.0036 + dot.phase) % 1
      const travel = u < 0.5 ? u * 2 : (1 - u) * 2
      const eased = travel * travel * (3 - 2 * travel)
      const home = centers[dot.home]
      const destination = centers[dot.destination]
      const x = p.lerp(home[0] * ctx.width + dot.ax, destination[0] * ctx.width + dot.bx, eased)
      const y = p.lerp(home[1] * ctx.height + dot.ay, destination[1] * ctx.height + dot.by, eased)
      const migrating = eased > 0.3 && eased < 0.7 && i % 17 === 0
      const ink = p.color(migrating ? pal.accent : pal.signal)
      ink.setAlpha(migrating ? 230 : 115 + (i % 5) * 20)
      p.fill(ink)
      p.circle(x, y, migrating ? dot.size * 1.8 : dot.size)
    }
  }
}
