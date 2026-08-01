import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SITES = 24
const MARGIN = 26
const STEP = 0.055
const HOLD_FRAMES = 120

type Pt = { x: number; y: number }

// Sutherland-Hodgman clip: keep the half-plane closer to `a` than to `b`.
function bisect(poly: Pt[], a: Pt, b: Pt): Pt[] {
  const nx = b.x - a.x
  const ny = b.y - a.y
  const c = (nx * (a.x + b.x) + ny * (a.y + b.y)) / 2
  const out: Pt[] = []
  for (let i = 0; i < poly.length; i++) {
    const s = poly[i]!
    const e = poly[(i + 1) % poly.length]!
    const ds = nx * s.x + ny * s.y - c
    const de = nx * e.x + ny * e.y - c
    if (ds <= 0) out.push(s)
    if (ds * de < 0) {
      const t = ds / (ds - de)
      out.push({ x: s.x + (e.x - s.x) * t, y: s.y + (e.y - s.y) * t })
    }
  }
  return out
}

function centroid(poly: Pt[]): Pt {
  let a = 0
  let cx = 0
  let cy = 0
  for (let i = 0; i < poly.length; i++) {
    const s = poly[i]!
    const e = poly[(i + 1) % poly.length]!
    const cross = s.x * e.y - e.x * s.y
    a += cross
    cx += (s.x + e.x) * cross
    cy += (s.y + e.y) * cross
  }
  if (Math.abs(a) < 1e-6) return poly[0]!
  return { x: cx / (3 * a), y: cy / (3 * a) }
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let sites: Pt[] = []
  let phase: 'relax' | 'hold' | 'fade' = 'relax'
  let phaseFrame = 0
  let alpha = 1

  const scatter = () => {
    sites = []
    for (let i = 0; i < SITES; i++) {
      sites.push({ x: p.random(MARGIN, p.width - MARGIN), y: p.random(MARGIN, p.height - MARGIN) })
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    scatter()
  }

  p.draw = () => {
    p.background(pal.bg)
    phaseFrame++

    const frame: Pt[] = [
      { x: MARGIN, y: MARGIN },
      { x: p.width - MARGIN, y: MARGIN },
      { x: p.width - MARGIN, y: p.height - MARGIN },
      { x: MARGIN, y: p.height - MARGIN },
    ]

    // scan bar sweeps the mesh so the relaxed state still reads as live
    const scanX = ((p.frameCount * 2.4) % (p.width + 180)) - 90
    let drift = 0
    for (let i = 0; i < sites.length; i++) {
      const s = sites[i]!
      let cell = frame
      for (let j = 0; j < sites.length; j++) {
        if (j !== i) cell = bisect(cell, s, sites[j]!)
      }
      if (cell.length < 3) continue
      const cen = centroid(cell)
      const gap = p.dist(s.x, s.y, cen.x, cen.y)
      drift = p.max(drift, gap)

      const scan = p.max(0, 1 - p.abs(s.x - scanX) / 85)
      const edge = p.color(i % 8 === 3 ? pal.accent : pal.signal)
      edge.setAlpha(p.min(255, (i % 8 === 3 ? 190 : 100) + scan * 95) * alpha)
      p.stroke(edge)
      p.strokeWeight(1.1)
      p.beginShape()
      for (const v of cell) p.vertex(v.x, v.y)
      p.endShape(p.CLOSE)

      // relaxation vector: site -> cell centroid, vanishes as the mesh evens out
      if (gap > 0.4) {
        const pull = p.color(pal.dim)
        pull.setAlpha(170 * alpha)
        p.stroke(pull)
        p.line(s.x, s.y, cen.x, cen.y)
      }
      const dot = p.color(pal.paper)
      dot.setAlpha((165 + 25 * p.sin(p.frameCount * 0.05 + i)) * alpha)
      p.stroke(dot)
      p.strokeWeight(2.6)
      p.point(s.x, s.y)
      p.strokeWeight(1.1)

      if (phase === 'relax') {
        s.x += (cen.x - s.x) * STEP
        s.y += (cen.y - s.y) * STEP
      }
    }

    if (phase === 'relax' && (drift < 0.35 || phaseFrame > 900)) {
      phase = 'hold'
      phaseFrame = 0
    } else if (phase === 'hold' && phaseFrame > HOLD_FRAMES) {
      phase = 'fade'
      phaseFrame = 0
    } else if (phase === 'fade') {
      alpha = p.max(0, 1 - phaseFrame / 40)
      if (alpha <= 0) {
        scatter()
        alpha = 1
        phase = 'relax'
        phaseFrame = 0
      }
    }
  }
}
