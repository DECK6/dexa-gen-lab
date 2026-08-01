import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 22
const K = 0.26
const HOME = 0.012
const DAMP = 0.973
const PERIOD = 105
const NB = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const px: number[] = []
  const py: number[] = []
  const vx: number[] = []
  const vy: number[] = []
  const hx: number[] = []
  const hy: number[] = []
  let gap = 0
  let hitAt = 0
  let hitX = 0
  let hitY = 0

  const idx = (i: number, j: number) => j * N + i

  const impulse = () => {
    const k = idx(Math.floor(p.random(2, N - 2)), Math.floor(p.random(2, N - 2)))
    const ang = p.random(p.TWO_PI)
    const mag = p.random(5, 11)
    vx[k] += Math.cos(ang) * mag
    vy[k] += Math.sin(ang) * mag
    hitX = hx[k]
    hitY = hy[k]
    hitAt = p.frameCount
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    gap = (Math.min(p.width, p.height) * 0.82) / (N - 1)
    const x0 = (p.width - gap * (N - 1)) / 2
    const y0 = (p.height - gap * (N - 1)) / 2
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        hx.push(x0 + i * gap)
        hy.push(y0 + j * gap)
        px.push(x0 + i * gap)
        py.push(y0 + j * gap)
        vx.push(0)
        vy.push(0)
      }
    }
    p.strokeWeight(1)
    impulse()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(30)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    if (p.frameCount - hitAt > PERIOD) impulse()

    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const k = idx(i, j)
        if (i === 0 || j === 0 || i === N - 1 || j === N - 1) {
          vx[k] = 0
          vy[k] = 0
          continue
        }
        let fx = (hx[k] - px[k]) * HOME
        let fy = (hy[k] - py[k]) * HOME
        for (const nb of NB) {
          const ii = i + nb[0]
          const jj = j + nb[1]
          if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue
          const n = idx(ii, jj)
          const dx = px[n] - px[k]
          const dy = py[n] - py[k]
          const len = Math.hypot(dx, dy) + 1e-6
          const f = (len - gap) * K
          fx += (dx / len) * f
          fy += (dy / len) * f
        }
        vx[k] = (vx[k] + fx) * DAMP
        vy[k] = (vy[k] + fy) * DAMP
      }
    }
    for (let k = 0; k < px.length; k++) {
      px[k] += vx[k]
      py[k] += vy[k]
    }

    // stroke brightness tracks how far a node has been pushed from home
    const cols = [10, 26, 54, 96, 155].map((alpha) => {
      const col = p.color(pal.signal)
      col.setAlpha(alpha)
      return col
    })
    let level = -1
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const k = idx(i, j)
        const off = Math.hypot(px[k] - hx[k], py[k] - hy[k]) / (gap * 0.6)
        const lv = Math.min(4, Math.floor(off * 5))
        if (lv !== level) {
          p.stroke(cols[lv])
          level = lv
        }
        if (i < N - 1) p.line(px[k], py[k], px[idx(i + 1, j)], py[idx(i + 1, j)])
        if (j < N - 1) p.line(px[k], py[k], px[idx(i, j + 1)], py[idx(i, j + 1)])
      }
    }

    const age = p.frameCount - hitAt
    if (age < 70) {
      const ring = p.color(pal.accent)
      ring.setAlpha(150 * (1 - age / 70))
      p.noFill()
      p.stroke(ring)
      p.circle(hitX, hitY, age * gap * 0.55)
    }
  }
}
