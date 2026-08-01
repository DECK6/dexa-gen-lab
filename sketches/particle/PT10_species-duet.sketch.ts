import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const NA = 300
const NB = 190
const R = 46 // interaction radius, also the hash cell size
const CORE = 12 // hard-core repulsion distance
const MAX_SPD = 2.2

// non-reciprocal matrix: A chases B, B flees A — the chase never settles
const AA = -0.3
const AB = 0.95
const BA = -0.95
const BB = 0.3

interface Part {
  x: number
  y: number
  vx: number
  vy: number
  b: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const parts: Part[] = []
  const cells: number[][] = []
  let cols = 0
  let rows = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    cols = Math.max(3, Math.floor(p.width / R))
    rows = Math.max(3, Math.floor(p.height / R))
    for (let i = 0; i < cols * rows; i++) cells.push([])
    for (let i = 0; i < NA + NB; i++) {
      parts.push({ x: p.random(p.width), y: p.random(p.height), vx: 0, vy: 0, b: i >= NA })
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(22)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const w = p.width
    const h = p.height
    const hw = w / 2
    const hh = h / 2
    const cw = w / cols
    const ch = h / rows

    for (let i = 0; i < cells.length; i++) cells[i].length = 0
    for (let i = 0; i < parts.length; i++) {
      const o = parts[i]
      const c = p.constrain(Math.floor(o.x / cw), 0, cols - 1)
      const r = p.constrain(Math.floor(o.y / ch), 0, rows - 1)
      cells[r * cols + c].push(i)
    }

    const f = p.frameCount
    for (let i = 0; i < parts.length; i++) {
      const o = parts[i]
      let fx = 0
      let fy = 0
      const c0 = p.constrain(Math.floor(o.x / cw), 0, cols - 1)
      const r0 = p.constrain(Math.floor(o.y / ch), 0, rows - 1)
      for (let rr = r0 - 1; rr <= r0 + 1; rr++) {
        for (let cc = c0 - 1; cc <= c0 + 1; cc++) {
          const bucket = cells[((rr + rows) % rows) * cols + ((cc + cols) % cols)]
          for (let k = 0; k < bucket.length; k++) {
            const j = bucket[k]
            if (j === i) continue
            const b = parts[j]
            let dx = b.x - o.x
            let dy = b.y - o.y
            if (dx > hw) dx -= w
            else if (dx < -hw) dx += w
            if (dy > hh) dy -= h
            else if (dy < -hh) dy += h
            const d = Math.hypot(dx, dy)
            if (d >= R || d === 0) continue
            let g: number
            if (d < CORE) {
              g = -(1 - d / CORE) * 2.2 // hard core, species-blind
            } else {
              const rule = o.b ? (b.b ? BB : BA) : b.b ? AB : AA
              g = rule * (1 - Math.abs(2 * d - CORE - R) / (R - CORE))
            }
            fx += (dx / d) * g
            fy += (dy / d) * g
          }
        }
      }
      const drift = p.noise(o.x * 0.004, o.y * 0.004, f * 0.0016) - 0.5
      fx += Math.cos(drift * p.TWO_PI * 2) * 0.06
      fy += Math.sin(drift * p.TWO_PI * 2) * 0.06

      o.vx = (o.vx + fx * 0.07) * 0.86
      o.vy = (o.vy + fy * 0.07) * 0.86
      const sp = Math.hypot(o.vx, o.vy)
      if (sp > MAX_SPD) {
        o.vx = (o.vx / sp) * MAX_SPD
        o.vy = (o.vy / sp) * MAX_SPD
      }
      o.x = (o.x + o.vx + w) % w
      o.y = (o.y + o.vy + h) % h
    }

    const cyan = p.color(pal.signal)
    cyan.setAlpha(170)
    const orange = p.color(pal.accent)
    orange.setAlpha(190)
    p.strokeWeight(1)
    for (let i = 0; i < parts.length; i++) {
      const o = parts[i]
      p.stroke(o.b ? orange : cyan)
      p.line(o.x, o.y, o.x - o.vx * 2.6, o.y - o.vy * 2.6)
      p.point(o.x, o.y)
    }
  }
}
