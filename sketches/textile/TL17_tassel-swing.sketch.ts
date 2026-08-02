import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 13

interface Tassel {
  theta: number
  omega: number
  length: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const tassels: Tassel[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < COUNT; i++) {
      tassels.push({
        theta: p.random(-0.65, 0.65),
        omega: p.random(-0.018, 0.018),
        length: p.random(p.height * 0.28, p.height * 0.42),
      })
    }
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const railY = p.height * 0.22
    const spacing = p.width * 0.82 / (COUNT - 1)
    p.stroke(ctx.palette.dim)
    p.strokeWeight(8)
    p.line(p.width * 0.09, railY, p.width * 0.91, railY)

    for (let i = 0; i < COUNT; i++) {
      const tassel = tassels[i]!
      const drive = Math.sin(p.frameCount * 0.025 + i * 0.38) * 0.0018
      tassel.omega += -0.012 * Math.sin(tassel.theta) - tassel.omega * 0.018 + drive
      tassel.theta += tassel.omega
      const pivotX = p.width * 0.09 + i * spacing
      const bobX = pivotX + Math.sin(tassel.theta) * tassel.length
      const bobY = railY + Math.cos(tassel.theta) * tassel.length
      const cord = p.color(i % 6 === 0 ? ctx.palette.accent : ctx.palette.signal)
      cord.setAlpha(190)
      p.stroke(cord)
      p.strokeWeight(2.2)
      p.line(pivotX, railY, bobX, bobY)

      p.noStroke()
      p.fill(ctx.palette.paper)
      p.circle(pivotX, railY, 6)
      p.fill(i % 6 === 0 ? ctx.palette.accent : ctx.palette.signal)
      p.circle(bobX, bobY, 10)
      p.stroke(cord)
      p.strokeWeight(1.3)
      for (let fiber = -4; fiber <= 4; fiber++) {
        const fan = tassel.theta * 0.28 + fiber * 0.055
        const fiberLength = 34 + Math.abs(fiber) * 2
        p.line(bobX, bobY + 3, bobX + Math.sin(fan) * fiberLength, bobY + Math.cos(fan) * fiberLength)
      }
    }
  }
}
