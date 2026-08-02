import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Task { tx: number; ty: number; ox: number; oy: number; delay: number; robot: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const tasks: Task[] = []
  const robots = 16

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    const origins = Array.from({ length: robots }, (_, i) => ({ x: i % 2 === 0 ? 58 : p.width - 58, y: 520 + (i % 8) * 7 }))
    const loads = new Array<number>(robots).fill(0)
    for (let row = 0; row < 6; row++) for (let col = 0; col < 13; col++) {
      if (row < 4 && col >= 3 && col <= 9) continue
      const tx = 152 + col * 28
      const ty = 500 - row * 28
      let best = 0
      let bid = Infinity
      for (let i = 0; i < robots; i++) {
        const origin = origins[i]!
        const cost = loads[i]! * 42 + p.dist(origin.x, origin.y, tx, ty) * 0.08
        if (cost < bid) { bid = cost; best = i }
      }
      const origin = origins[best]!
      tasks.push({ tx, ty, ox: origin.x, oy: origin.y, delay: loads[best]! * 15 + (best % 4) * 3, robot: best })
      loads[best]++
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const cycle = (p.frameCount - 1) % 290
    const scaffold = p.color(ctx.palette.signal); scaffold.setAlpha(38)
    p.stroke(scaffold); p.strokeWeight(1); p.noFill()
    for (const task of tasks) p.rect(task.tx - 12, task.ty - 12, 24, 24, 2)
    p.stroke(ctx.palette.dim)
    for (let x = 40; x < p.width; x += 40) p.line(x, 555, x, 565)
    p.line(40, 565, p.width - 40, 565)

    for (const task of tasks) {
      let q = p.constrain((cycle - task.delay) / 42, 0, 1)
      if (cycle > 235) q *= p.constrain((285 - cycle) / 50, 0, 1)
      const arc = Math.sin(q * Math.PI) * (46 + (task.robot % 4) * 7)
      const x = p.lerp(task.ox, task.tx, q)
      const y = p.lerp(task.oy, task.ty, q) - arc
      if (q >= 0.995) {
        p.noStroke(); p.fill(ctx.palette.signal); p.rect(task.tx - 11, task.ty - 11, 22, 22, 2)
        if ((task.robot + p.frameCount) % 37 === 0) { p.fill(ctx.palette.accent); p.circle(task.tx, task.ty, 7) }
      } else if (q > 0) {
        p.noStroke(); p.fill(ctx.palette.accent); p.circle(x, y, 9)
        p.fill(ctx.palette.paper); p.rect(x - 7, y - 15, 14, 9, 2)
      }
    }
    const scan = 130 + ((p.frameCount * 2.1) % 380)
    const beam = p.color(ctx.palette.accent); beam.setAlpha(105)
    p.stroke(beam); p.line(scan, 325, scan, 525)
    p.noStroke(); p.fill(ctx.palette.paper); p.textAlign(p.LEFT); p.textSize(10)
    p.text(cycle > 235 ? 'DISASSEMBLY / REQUEUE' : 'AUCTION ASSIGN / ASSEMBLY', 42, 52)
  }
}
