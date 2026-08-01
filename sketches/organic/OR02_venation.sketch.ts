import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

// Space colonization (Runions et al.) — attraction points colonize a growing vein network.
const ATTRACTORS = 850
const ATTRACT_D = 80
const KILL_D = 10
const STEP = 3.4
const CELL = 80
const MAX_NODES = 4200

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let nx: number[] = []
  let ny: number[] = []
  let par: number[] = []
  let flow: number[] = []
  let att: { x: number; y: number }[] = []
  let tips: number[] = []
  let phase = 0
  let timer = 0
  let idle = 0

  const reset = () => {
    att = []
    tips = []
    const len = p.height * 0.8
    const baseY = p.height * 0.95
    const cx = p.width * 0.5
    while (att.length < ATTRACTORS) {
      const t = p.random()
      const hw = Math.sin(Math.pow(t, 0.62) * p.PI) * 0.46 * (1 - t * 0.22)
      if (p.random() > hw * 2.1) continue
      att.push({ x: cx + p.random(-hw, hw) * p.width, y: baseY - t * len })
    }
    nx = [cx]
    ny = [baseY]
    par = [-1]
    flow = [0]
    phase = 0
    timer = 0
    idle = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    reset()
  }

  const grow = () => {
    tips = []
    const grid = new Map<number, number[]>()
    for (let i = 0; i < nx.length; i++) {
      const k = Math.floor(nx[i]! / CELL) * 4096 + Math.floor(ny[i]! / CELL)
      const bin = grid.get(k)
      if (bin) bin.push(i)
      else grid.set(k, [i])
    }
    const dirs = new Map<number, { x: number; y: number }>()
    const alive: { x: number; y: number }[] = []
    for (const a of att) {
      const cx = Math.floor(a.x / CELL)
      const cy = Math.floor(a.y / CELL)
      let best = -1
      let bd = ATTRACT_D * ATTRACT_D
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const bin = grid.get((cx + ox) * 4096 + (cy + oy))
          if (!bin) continue
          for (let bi = 0; bi < bin.length; bi++) {
            const i = bin[bi]!
            const d2 = (nx[i]! - a.x) ** 2 + (ny[i]! - a.y) ** 2
            if (d2 >= bd) continue
            bd = d2
            best = i
          }
        }
      }
      if (best >= 0 && bd < KILL_D * KILL_D) continue
      alive.push(a)
      if (best < 0) continue
      const d = Math.sqrt(bd)
      const ux = (a.x - nx[best]!) / d
      const uy = (a.y - ny[best]!) / d
      const cur = dirs.get(best)
      if (cur) {
        cur.x += ux
        cur.y += uy
      } else dirs.set(best, { x: ux, y: uy })
    }
    att = alive
    for (const [i, d] of dirs) {
      if (nx.length >= MAX_NODES) break
      const j = (p.noise(nx[i]! * 0.012, ny[i]! * 0.012) - 0.5) * 0.5
      const ux = d.x - d.y * j
      const uy = d.y + d.x * j
      const m = Math.hypot(ux, uy) || 1
      nx.push(nx[i]! + (ux / m) * STEP)
      ny.push(ny[i]! + (uy / m) * STEP)
      par.push(i)
      flow.push(0)
      tips.push(nx.length - 1)
      for (let k = i; k >= 0; k = par[k]!) flow[k]!++
    }
    idle = dirs.size === 0 ? idle + 1 : 0
  }

  p.draw = () => {
    p.background(pal.bg)
    if (phase === 0) {
      grow()
      if (att.length === 0 || idle > 30 || nx.length >= MAX_NODES) {
        phase = 1
        timer = 0
      }
    } else if (phase === 1) {
      if (++timer > 160) {
        phase = 2
        timer = 0
      }
    } else if (++timer > 80) {
      reset()
      return
    }
    const fade = phase === 2 ? 1 - timer / 80 : 1

    const seed = p.color(pal.dim)
    seed.setAlpha(46 * fade)
    p.stroke(seed)
    p.strokeWeight(1)
    for (const a of att) p.point(a.x, a.y)

    const vein = p.color(pal.signal)
    p.strokeCap(p.ROUND)
    for (let i = 1; i < nx.length; i++) {
      const f = flow[i]!
      vein.setAlpha((70 + Math.min(140, f * 4)) * fade)
      p.stroke(vein)
      p.strokeWeight(Math.min(2.8, 0.5 + Math.sqrt(f) * 0.19))
      p.line(nx[par[i]!]!, ny[par[i]!]!, nx[i]!, ny[i]!)
    }

    const bud = p.color(pal.accent)
    bud.setAlpha(200 * fade)
    p.noStroke()
    p.fill(bud)
    for (const i of tips) p.ellipse(nx[i]!, ny[i]!, 2.2, 2.2)
  }
}
