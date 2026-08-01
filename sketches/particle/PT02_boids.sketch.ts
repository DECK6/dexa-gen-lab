import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 280
const R = 34 // perception radius, also the spatial hash cell size
const SEP_R = 15
const MAX_SPD = 2.6
const MAX_F = 0.07

interface Boid {
  x: number
  y: number
  vx: number
  vy: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const flock: Boid[] = []
  const cells: number[][] = []
  let cols = 0
  let rows = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    cols = Math.ceil(p.width / R)
    rows = Math.ceil(p.height / R)
    for (let i = 0; i < cols * rows; i++) cells.push([])
    for (let i = 0; i < N; i++) {
      const a = p.random(p.TWO_PI)
      flock.push({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: Math.cos(a) * MAX_SPD,
        vy: Math.sin(a) * MAX_SPD,
      })
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(20)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    for (let i = 0; i < cells.length; i++) cells[i].length = 0
    for (let i = 0; i < N; i++) {
      const b = flock[i]
      const c = p.constrain(Math.floor(b.x / R), 0, cols - 1)
      const r = p.constrain(Math.floor(b.y / R), 0, rows - 1)
      cells[r * cols + c].push(i)
    }

    const margin = p.width * 0.1
    for (let i = 0; i < N; i++) {
      const o = flock[i]
      let ax = 0
      let ay = 0
      let cxs = 0
      let cys = 0
      let sx = 0
      let sy = 0
      let nn = 0
      let ns = 0
      const c0 = p.constrain(Math.floor(o.x / R), 0, cols - 1)
      const r0 = p.constrain(Math.floor(o.y / R), 0, rows - 1)
      for (let r = Math.max(0, r0 - 1); r <= Math.min(rows - 1, r0 + 1); r++) {
        for (let c = Math.max(0, c0 - 1); c <= Math.min(cols - 1, c0 + 1); c++) {
          const bucket = cells[r * cols + c]
          for (let k = 0; k < bucket.length; k++) {
            const j = bucket[k]
            if (j === i) continue
            const b = flock[j]
            const dx = b.x - o.x
            const dy = b.y - o.y
            const d2 = dx * dx + dy * dy
            if (d2 > R * R || d2 === 0) continue
            ax += b.vx
            ay += b.vy
            cxs += b.x
            cys += b.y
            nn++
            if (d2 < SEP_R * SEP_R) {
              sx -= dx / d2
              sy -= dy / d2
              ns++
            }
          }
        }
      }

      let fx = 0
      let fy = 0
      if (nn > 0) {
        const alm = Math.hypot(ax, ay) || 1
        fx += ((ax / alm) * MAX_SPD - o.vx) * 0.55
        fy += ((ay / alm) * MAX_SPD - o.vy) * 0.55
        const chx = cxs / nn - o.x
        const chy = cys / nn - o.y
        const chm = Math.hypot(chx, chy) || 1
        fx += ((chx / chm) * MAX_SPD - o.vx) * 0.4
        fy += ((chy / chm) * MAX_SPD - o.vy) * 0.4
      }
      if (ns > 0) {
        const sm = Math.hypot(sx, sy) || 1
        fx += ((sx / sm) * MAX_SPD - o.vx) * 1.35
        fy += ((sy / sm) * MAX_SPD - o.vy) * 1.35
      }
      if (o.x < margin) fx += (1 - o.x / margin) * 0.5
      if (o.x > p.width - margin) fx -= (1 - (p.width - o.x) / margin) * 0.5
      if (o.y < margin) fy += (1 - o.y / margin) * 0.5
      if (o.y > p.height - margin) fy -= (1 - (p.height - o.y) / margin) * 0.5

      const fm = Math.hypot(fx, fy)
      if (fm > MAX_F) {
        fx = (fx / fm) * MAX_F
        fy = (fy / fm) * MAX_F
      }
      o.vx += fx
      o.vy += fy
      const sp = Math.hypot(o.vx, o.vy) || 1
      o.vx = (o.vx / sp) * MAX_SPD
      o.vy = (o.vy / sp) * MAX_SPD
      o.x = p.constrain(o.x + o.vx, 1, p.width - 1)
      o.y = p.constrain(o.y + o.vy, 1, p.height - 1)
    }

    const cyan = p.color(pal.signal)
    cyan.setAlpha(150)
    const orange = p.color(pal.accent)
    orange.setAlpha(190)
    p.strokeWeight(1)
    for (let i = 0; i < N; i++) {
      const o = flock[i]
      p.stroke(i % 29 === 0 ? orange : cyan)
      p.line(o.x, o.y, o.x - o.vx * 3.6, o.y - o.vy * 3.6)
      p.point(o.x, o.y)
    }
  }
}
