import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MSG = 'DEXA GENERATIVE SIGNAL LAB'
const PAIRS = [[5, 1], [6, 2], [7, 3], [0, 4], [5, 2], [6, 3], [7, 4], [0, 5]]
const GRID = 5

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette

  const angle = (index: number) => index * p.PI / 4 - p.HALF_PI

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    p.strokeWeight(Math.max(1.5, p.width * 0.004))
  }

  p.draw = () => {
    p.background(pal.bg)
    const cell = Math.min(p.width, p.height) * 0.155
    const ox = (p.width - cell * GRID) * 0.5
    const oy = p.height * 0.16
    const arm = cell * 0.27

    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        const i = gy * GRID + gx
        const clock = p.frameCount * 0.022 + i * 0.13
        const state = Math.floor(clock)
        const q = clock - state
        const ease = q * q * (3 - 2 * q)
        const a = PAIRS[state % PAIRS.length]!
        const b = PAIRS[(state + 1) % PAIRS.length]!
        const a0 = angle(a[0]!)
        const a1 = angle(a[1]!)
        const leftA = a0 + Math.atan2(Math.sin(angle(b[0]!) - a0), Math.cos(angle(b[0]!) - a0)) * ease
        const rightA = a1 + Math.atan2(Math.sin(angle(b[1]!) - a1), Math.cos(angle(b[1]!) - a1)) * ease
        const x = ox + (gx + 0.5) * cell
        const y = oy + (gy + 0.5) * cell
        const hot = i === Math.floor((p.frameCount * 0.12) % (GRID * GRID))
        const ink = p.color(hot ? pal.accent : pal.signal)
        ink.setAlpha(hot ? 245 : 175)
        p.stroke(ink)
        p.noFill()
        p.line(x, y + arm * 0.12, x, y + arm * 0.7)
        p.circle(x, y - arm * 0.18, arm * 0.22)

        for (const a2 of [leftA, rightA]) {
          const ex = x + Math.cos(a2) * arm
          const ey = y + Math.sin(a2) * arm
          p.line(x, y, ex, ey)
          p.push()
          p.translate(ex, ey)
          p.rotate(a2)
          p.noStroke()
          p.fill(hot ? pal.accent : pal.signal)
          p.triangle(0, 0, -cell * 0.13, -cell * 0.065, -cell * 0.13, cell * 0.065)
          p.pop()
        }

        p.noStroke()
        const tag = p.color(pal.dim)
        tag.setAlpha(120)
        p.fill(tag)
        p.textSize(cell * 0.13)
        p.text(MSG.charAt((state + i) % MSG.length), x, y + cell * 0.38)
      }
    }
  }
}
