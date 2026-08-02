import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const G = 20
const TOTAL = G * G

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const angle = new Float32Array(TOTAL)
  const spin = new Float32Array(TOTAL)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < TOTAL; i++) angle[i] = p.random(p.TWO_PI)
    p.strokeCap(p.SQUARE)
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.009
    const poleX = p.width / 2 + Math.cos(t * 0.73) * p.width * 0.31
    const poleY = p.height / 2 + Math.sin(t * 1.13) * p.height * 0.27
    const cw = p.width / G
    const ch = p.height / G
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    const dim = p.color(pal.dim)

    for (let j = 0; j < G; j++) {
      for (let i = 0; i < G; i++) {
        const index = j * G + i
        const x = (i + 0.5) * cw
        const y = (j + 0.5) * ch
        const target = Math.atan2(poleY - y, poleX - x)
        const error = Math.atan2(Math.sin(target - angle[index]!), Math.cos(target - angle[index]!))
        const delay = 0.018 + (i + j) / (G * 2) * 0.018
        spin[index] = (spin[index]! + error * delay) * 0.9
        angle[index]! += spin[index]!
        const energy = p.constrain(Math.abs(spin[index]!) / 0.13, 0, 1)
        const dx = Math.cos(angle[index]!) * cw * 0.33
        const dy = Math.sin(angle[index]!) * ch * 0.33
        dim.setAlpha(100)
        p.stroke(dim)
        p.strokeWeight(1)
        p.line(x - dx * 0.55, y - dy * 0.55, x, y)
        cyan.setAlpha(85 + energy * 145)
        p.stroke(cyan)
        p.strokeWeight(1.1 + energy)
        p.line(x, y, x + dx, y + dy)
      }
    }

    orange.setAlpha(210)
    p.noFill()
    p.stroke(orange)
    p.strokeWeight(1.5)
    p.circle(poleX, poleY, 15)
    p.line(poleX - 10, poleY, poleX + 10, poleY)
    p.line(poleX, poleY - 10, poleX, poleY + 10)
  }
}
