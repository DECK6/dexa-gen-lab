import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SET = '#@$%&*+=/\\|<>~^!?:;'
const N = 26
const GEN_EVERY = 7

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const cells: number[] = []
  const age: number[] = []
  let cw = 0
  let gen = 0

  const idx = (x: number, y: number) => ((y + N) % N) * N + ((x + N) % N)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    cw = p.width / N
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    p.noStroke()
    for (let i = 0; i < N * N; i++) {
      cells.push(Math.floor(p.random(SET.length)))
      age.push(Math.floor(p.random(40)))
    }
  }

  const step = () => {
    gen++
    const next = cells.slice()
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const i = idx(x, y)
        // mutation pressure drifts across the grid as slow noise regions
        const rate = p.noise(x * 0.11, y * 0.11, gen * 0.045)
        if (p.random() < rate * rate * 0.55) {
          if (p.random() < 0.65) {
            const dx = Math.floor(p.random(3)) - 1
            const dy = Math.floor(p.random(3)) - 1
            next[i] = cells[idx(x + dx, y + dy)]!
          } else {
            next[i] = Math.floor(p.random(SET.length))
          }
          age[i] = 0
        } else {
          age[i]++
        }
      }
    }
    for (let i = 0; i < cells.length; i++) cells[i] = next[i]!
  }

  p.draw = () => {
    p.background(pal.bg)
    if (p.frameCount % GEN_EVERY === 0) step()

    const breath = p.frameCount * 0.05
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const i = idx(x, y)
        const a = age[i]!
        const fresh = a < 2
        const c = p.color(fresh ? pal.accent : a < 14 ? pal.signal : pal.dim)
        const settle = p.constrain(1 - a / 60, 0.12, 1)
        c.setAlpha(fresh ? 250 : 45 + 175 * settle)
        p.fill(c)
        const pulse = 1 + 0.16 * Math.sin(breath + (x + y) * 0.4) * settle
        p.textSize(cw * 0.86 * (fresh ? 1.18 : pulse))
        p.text(SET.charAt(cells[i]!), (x + 0.5) * cw, (y + 0.5) * cw + (p.height - N * cw) * 0.5)
      }
    }
  }
}
