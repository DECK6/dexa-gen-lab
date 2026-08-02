import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Server { ewma: number; capacity: number }
interface Job { server: number; remaining: number; age: number; size: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const servers: Server[] = Array.from({ length: 7 }, (_, i) => ({ ewma: 0, capacity: 0.72 + i * 0.055 }))
  const jobs: Job[] = []

  const assign = () => {
    let target = 0
    let score = Infinity
    for (let i = 0; i < servers.length; i++) {
      const active = jobs.filter((job) => job.server === i).reduce((sum, job) => sum + job.remaining, 0)
      const load = active / servers[i]!.capacity + servers[i]!.ewma * 18
      if (load < score) { score = load; target = i }
    }
    jobs.push({ server: target, remaining: p.random(24, 72), age: 0, size: p.random(0.8, 1.25) })
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < 18; i++) assign()
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const phase = p.frameCount % 210
    if (p.frameCount % 9 === 0) assign()
    if (phase > 48 && phase < 78 && p.frameCount % 3 === 0) { assign(); assign() }
    for (let i = jobs.length - 1; i >= 0; i--) {
      const job = jobs[i]!
      job.age++
      job.remaining -= servers[job.server]!.capacity
      if (job.remaining <= 0) jobs.splice(i, 1)
    }
    for (let i = 0; i < servers.length; i++) {
      const active = jobs.filter((job) => job.server === i).length
      servers[i]!.ewma = servers[i]!.ewma * 0.92 + active * 0.08
    }

    const bx = 118
    const by = p.height / 2
    p.noFill(); p.stroke(ctx.palette.signal); p.strokeWeight(2); p.circle(bx, by, 76)
    p.noStroke(); p.fill(ctx.palette.paper); p.textAlign(p.CENTER); p.textSize(11); p.text('EWMA', bx, by + 4)
    for (let i = 0; i < servers.length; i++) {
      const server = servers[i]!
      const y = 82 + i * 78
      const x = 438
      const load = jobs.filter((job) => job.server === i).length
      p.stroke(ctx.palette.dim); p.line(bx + 39, by, x - 90, y)
      p.noFill(); p.stroke(load > 9 ? ctx.palette.accent : ctx.palette.signal); p.rect(x - 70, y - 23, 140, 46, 4)
      p.noStroke(); p.fill(ctx.palette.signal); p.rect(x - 62, y + 8, Math.min(124, server.ewma * 11), 6)
      p.fill(ctx.palette.paper); p.textAlign(p.LEFT); p.text(`S${i + 1}  ${load}`, x - 60, y)
    }
    p.noStroke()
    for (const job of jobs) {
      if (job.age > 22) continue
      const q = job.age / 22
      const y = 82 + job.server * 78
      p.fill(job.size > 1.08 ? ctx.palette.accent : ctx.palette.signal)
      p.circle(p.lerp(bx + 39, 348, q), p.lerp(by, y, q), 5 + job.size * 2)
    }
  }
}
