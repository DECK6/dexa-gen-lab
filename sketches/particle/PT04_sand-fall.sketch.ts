import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 120
const REPOSE = 1 // max neighbour height gap in grains before the slope gives way
const RELAX = 300 // topple probes per frame
const SPAWN = 3

interface Grain {
  x: number
  y: number
  vy: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const heights: number[] = []
  const heat: number[] = []
  const falling: Grain[] = []
  let gw = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    gw = p.width / COLS
    for (let c = 0; c < COLS; c++) {
      heights.push(0)
      heat.push(0)
    }
  }

  p.draw = () => {
    p.background(pal.bg)
    const f = p.frameCount

    const spout = p.width * (0.5 + (p.noise(f * 0.0017) - 0.5) * 0.8)
    for (let i = 0; i < SPAWN; i++) {
      falling.push({ x: spout + p.random(-6, 6), y: -p.random(20), vy: p.random(1, 2.4) })
    }

    for (let i = falling.length - 1; i >= 0; i--) {
      const gr = falling[i]
      gr.vy += 0.32
      gr.y += gr.vy
      const c = p.constrain(Math.floor(gr.x / gw), 0, COLS - 1)
      if (gr.y >= p.height - heights[c] * gw) {
        heights[c]++
        heat[c] = 1
        falling[i] = falling[falling.length - 1]
        falling.pop()
      }
    }

    // avalanche: a column taller than its neighbour by more than the repose gap sheds one grain
    for (let k = 0; k < RELAX; k++) {
      const c = Math.floor(p.random(COLS))
      const hc = heights[c]
      if (hc === 0) continue
      const hl = c > 0 ? heights[c - 1] : 0
      const hr = c < COLS - 1 ? heights[c + 1] : 0
      const dl = hc - hl
      const dr = hc - hr
      if (dl <= REPOSE && dr <= REPOSE) continue
      const left = dl > dr || (dl === dr && p.random() < 0.5)
      heights[c] = hc - 1
      heat[c] = 1
      if (left) {
        if (c > 0) {
          heights[c - 1]++
          heat[c - 1] = 1
        }
      } else if (c < COLS - 1) {
        heights[c + 1]++
        heat[c + 1] = 1
      }
    }

    const body = p.color(pal.dim)
    body.setAlpha(120)
    p.noStroke()
    p.fill(body)
    p.beginShape()
    p.vertex(0, p.height)
    for (let c = 0; c < COLS; c++) {
      const y = p.height - heights[c] * gw
      p.vertex(c * gw, y)
      p.vertex((c + 1) * gw, y)
    }
    p.vertex(p.width, p.height)
    p.endShape()

    const crest = p.color(pal.signal)
    crest.setAlpha(180)
    p.stroke(crest)
    p.strokeWeight(1.2)
    p.noFill()
    p.beginShape()
    for (let c = 0; c < COLS; c++) p.vertex(c * gw + gw / 2, p.height - heights[c] * gw)
    p.endShape()

    const slide = p.color(pal.accent)
    p.strokeWeight(2)
    for (let c = 0; c < COLS; c++) {
      if (heat[c] < 0.06) continue
      slide.setAlpha(heat[c] * 230)
      p.stroke(slide)
      const y = p.height - heights[c] * gw
      p.line(c * gw, y, (c + 1) * gw, y)
      heat[c] *= 0.9
    }

    const drop = p.color(pal.signal)
    drop.setAlpha(220)
    p.noStroke()
    p.fill(drop)
    for (let i = 0; i < falling.length; i++) {
      const gr = falling[i]
      p.ellipse(gr.x, gr.y, gw * 0.8)
    }

    const base = p.color(pal.dim)
    base.setAlpha(90)
    p.stroke(base)
    p.strokeWeight(1)
    p.line(0, p.height - 0.5, p.width, p.height - 0.5)
  }
}
