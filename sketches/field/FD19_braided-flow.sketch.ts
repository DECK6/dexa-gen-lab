import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 980
const LANES = 28

interface Thread {
  x: number
  y: number
  lane: number
  phase: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const threads: Thread[] = []

  const spawn = (thread: Thread, lead = 0) => {
    thread.x = lead
    thread.y = (thread.lane + 0.5) / LANES * p.height + p.random(-6, 6)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < COUNT; i++) {
      const thread = { x: 0, y: 0, lane: i % LANES, phase: p.random(p.TWO_PI) }
      spawn(thread, p.random(p.width))
      threads.push(thread)
    }
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(15)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const z = p.frameCount * 0.0015
    const t = p.frameCount * 0.013
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    for (let i = 0; i < threads.length; i++) {
      const thread = threads[i]!
      const x = thread.x
      const y = thread.y
      const a = (p.noise(x * 0.003, y * 0.006, z) - 0.5) * 2.4
      const b = (p.noise(x * 0.003 + 41, y * 0.006 + 73, z + 19) - 0.5) * 2.4
      const gate = 0.5 + Math.sin(x * 0.024 - y * 0.031 + t + thread.phase * 0.15) * 0.5
      const ux = 1.25 + Math.cos(a) * (1 - gate) * 0.7 + Math.cos(b) * gate * 0.7
      const uy = Math.sin(a) * (1 - gate) * 1.5 - Math.sin(b) * gate * 1.5
      thread.x += ux
      thread.y += uy
      const switching = 1 - Math.abs(gate - 0.5) * 2
      const hot = i % 103 === 0
      const col = hot ? orange : cyan
      col.setAlpha((hot ? 80 : 24) + switching * (hot ? 145 : 105))
      p.stroke(col)
      p.strokeWeight(0.65 + switching * (hot ? 1.1 : 0.65))
      p.line(x, y, thread.x, thread.y)
      if (thread.x > p.width + 5 || thread.y < -12 || thread.y > p.height + 12) spawn(thread, -5)
    }
  }
}
