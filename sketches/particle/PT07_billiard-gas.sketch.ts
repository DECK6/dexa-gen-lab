import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 88
const SPD = 2.2
const FLASHES = 56

interface Disc {
  x: number
  y: number
  vx: number
  vy: number
}

interface Flash {
  x: number
  y: number
  age: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const gas: Disc[] = []
  const flashes: Flash[] = []
  let fi = 0
  let rad = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    rad = p.width * 0.0135
    for (let i = 0; i < N; i++) {
      const a = p.random(p.TWO_PI)
      gas.push({
        x: p.random(rad * 2, p.width - rad * 2),
        y: p.random(rad * 2, p.height - rad * 2),
        vx: Math.cos(a) * SPD,
        vy: Math.sin(a) * SPD,
      })
    }
    for (let i = 0; i < FLASHES; i++) flashes.push({ x: 0, y: 0, age: 99 })
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(36)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    for (let i = 0; i < N; i++) {
      const d = gas[i]
      d.x += d.vx
      d.y += d.vy
      if (d.x < rad) {
        d.x = rad
        d.vx = -d.vx
      } else if (d.x > p.width - rad) {
        d.x = p.width - rad
        d.vx = -d.vx
      }
      if (d.y < rad) {
        d.y = rad
        d.vy = -d.vy
      } else if (d.y > p.height - rad) {
        d.y = p.height - rad
        d.vy = -d.vy
      }
    }

    // equal-mass elastic response: swap the velocity components along the contact normal
    const span = rad * 2
    for (let i = 0; i < N; i++) {
      const a = gas[i]
      for (let j = i + 1; j < N; j++) {
        const b = gas[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy)
        if (d >= span || d === 0) continue
        const nx = dx / d
        const ny = dy / d
        const pa = a.vx * nx + a.vy * ny
        const pb = b.vx * nx + b.vy * ny
        if (pa - pb <= 0) continue
        const swap = pb - pa
        a.vx += nx * swap
        a.vy += ny * swap
        b.vx -= nx * swap
        b.vy -= ny * swap
        const push = (span - d) / 2
        a.x -= nx * push
        a.y -= ny * push
        b.x += nx * push
        b.y += ny * push
        const fl = flashes[fi]
        fl.x = a.x + nx * rad
        fl.y = a.y + ny * rad
        fl.age = 0
        fi = (fi + 1) % FLASHES
      }
    }

    const shell = p.color(pal.signal)
    shell.setAlpha(120)
    const trail = p.color(pal.dim)
    trail.setAlpha(150)
    p.noFill()
    for (let i = 0; i < N; i++) {
      const d = gas[i]
      p.stroke(trail)
      p.strokeWeight(1)
      p.line(d.x, d.y, d.x - d.vx * 4, d.y - d.vy * 4)
      p.stroke(shell)
      p.ellipse(d.x, d.y, span)
    }

    const spark = p.color(pal.accent)
    for (let i = 0; i < FLASHES; i++) {
      const fl = flashes[i]
      if (fl.age > 16) continue
      const k = 1 - fl.age / 16
      spark.setAlpha(k * 230)
      p.stroke(spark)
      p.strokeWeight(1.4 * k + 0.4)
      p.ellipse(fl.x, fl.y, rad * (0.6 + (1 - k) * 3.2))
      fl.age++
    }
  }
}
