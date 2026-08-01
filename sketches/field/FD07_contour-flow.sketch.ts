import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const G = 64 // cells per side
const LEVELS = 11
const SPACING = 0.05
const LOW = 0.24

// Marching-squares edge pairs per corner mask (0=top 1=right 2=bottom 3=left).
const CASES: number[][] = [
  [], [0, 3], [0, 1], [1, 3], [1, 2], [0, 3, 1, 2], [0, 2], [2, 3],
  [2, 3], [0, 2], [0, 1, 2, 3], [1, 2], [1, 3], [0, 1], [0, 3], [],
]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const field = new Float32Array((G + 1) * (G + 1))
  const ex = new Float32Array(4)
  const ey = new Float32Array(4)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    p.strokeWeight(1)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(70)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cs = p.width / G
    const rs = p.height / G
    const z = p.frameCount * 0.0014
    for (let j = 0; j <= G; j++) {
      for (let i = 0; i <= G; i++) {
        field[j * (G + 1) + i] = p.noise(i * 0.045, j * 0.045, z)
      }
    }

    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    // Thresholds creep upward, so contours crawl across the terrain.
    const creep = (p.frameCount * 0.00035) % SPACING

    for (let l = 0; l < LEVELS; l++) {
      const lv = LOW + l * SPACING + creep
      const major = l % 4 === 0
      const col = l === 5 ? orange : cyan
      col.setAlpha(major ? 130 : 52)
      p.stroke(col)
      p.strokeWeight(major ? 1.3 : 0.8)

      for (let j = 0; j < G; j++) {
        const y0 = j * rs
        for (let i = 0; i < G; i++) {
          const o = j * (G + 1) + i
          const a = field[o]!
          const b = field[o + 1]!
          const c = field[o + G + 2]!
          const d = field[o + G + 1]!
          const mask = (a > lv ? 1 : 0) | (b > lv ? 2 : 0) | (c > lv ? 4 : 0) | (d > lv ? 8 : 0)
          const pairs = CASES[mask]!
          if (pairs.length === 0) continue
          const x0 = i * cs
          ex[0] = x0 + cs * ((lv - a) / (b - a))
          ey[0] = y0
          ex[1] = x0 + cs
          ey[1] = y0 + rs * ((lv - b) / (c - b))
          ex[2] = x0 + cs * ((lv - d) / (c - d))
          ey[2] = y0 + rs
          ex[3] = x0
          ey[3] = y0 + rs * ((lv - a) / (d - a))
          for (let q = 0; q < pairs.length; q += 2) {
            const u = pairs[q]!
            const v = pairs[q + 1]!
            p.line(ex[u]!, ey[u]!, ex[v]!, ey[v]!)
          }
        }
      }
    }
  }
}
