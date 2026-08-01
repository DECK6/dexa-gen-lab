import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const CX = 14 // braille cells across
const CY = 9 // braille cells down
const THR = 0.54

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let cw = 0
  let ch = 0
  let mx = 0
  let my = 0
  let dx = 0
  let dy = 0
  let drift = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    mx = p.width * 0.06
    my = p.height * 0.06
    cw = (p.width - mx * 2) / CX
    ch = (p.height - my * 2) / CY
    dx = cw * 0.32 // dot pitch inside a cell
    dy = ch * 0.2
    drift = p.random(50)
    p.noStroke()
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.014
    const on = p.color(pal.signal)
    const edge = p.color(pal.accent)
    const off = p.color(pal.dim)

    for (let cy = 0; cy < CY; cy++) {
      for (let cx = 0; cx < CX; cx++) {
        const ox = mx + cx * cw + cw * 0.5
        const oy = my + cy * ch + ch * 0.5
        // 2 x 4 dot cell — the classic braille grid
        for (let c = 0; c < 2; c++) {
          for (let r = 0; r < 4; r++) {
            const gx = cx * 2 + c
            const gy = cy * 4 + r
            const wave = 0.5 + 0.5 * Math.sin(gx * 0.34 - t * 3.6 + Math.sin(gy * 0.2 + t) * 1.4)
            const n = p.noise(gx * 0.14 + drift - t * 0.8, gy * 0.09, t * 0.5)
            const v = n * 0.62 + wave * 0.42
            const x = ox + (c - 0.5) * dx
            const y = oy + (r - 1.5) * dy
            if (v > THR) {
              const ridge = v - THR < 0.035
              const c2 = ridge ? edge : on
              c2.setAlpha(ridge ? 235 : 120 + 135 * p.constrain((v - THR) * 5, 0, 1))
              p.fill(c2)
              p.circle(x, y, dx * (ridge ? 0.76 : 0.62))
            } else {
              off.setAlpha(26 + 60 * p.constrain(1 - (THR - v) * 6, 0, 1))
              p.fill(off)
              p.circle(x, y, dx * 0.22)
            }
          }
        }
      }
    }
  }
}
