import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COUNT = 900
const NV = 8 // vortices, alternating spin
const U0 = 1.6
const GAMMA = 150
const CORE = 800

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const px: number[] = []
  const py: number[] = []
  const vxs = new Float32Array(NV)
  const vys = new Float32Array(NV)
  let span = 0
  let obs = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    span = (p.width + 90) / NV
    obs = p.width * 0.13
    for (let k = 0; k < NV; k++) vxs[k] = obs + k * span
    for (let i = 0; i < COUNT; i++) {
      px.push(p.random(p.width))
      py.push(p.random(p.height))
    }
    p.strokeWeight(1)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(13)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const cy = p.height / 2
    const wag = Math.sin(p.frameCount * 0.008) * 22
    for (let k = 0; k < NV; k++) {
      vxs[k]! += U0 * 0.55
      if (vxs[k]! > p.width + 45) vxs[k]! -= NV * span
      const row = k % 2 === 0 ? -1 : 1
      vys[k] = cy + row * 30 + wag * row * 0.6 + Math.sin(p.frameCount * 0.02 + k) * 5
    }

    const cyan = p.color(pal.signal)
    for (let i = 0; i < COUNT; i++) {
      const x = px[i]!
      const y = py[i]!
      let ux = U0
      let uy = 0
      for (let k = 0; k < NV; k++) {
        const dx = x - vxs[k]!
        const dy = y - vys[k]!
        const g = (k % 2 === 0 ? GAMMA : -GAMMA) / (dx * dx + dy * dy + CORE)
        ux -= dy * g
        uy += dx * g
      }
      const sp = Math.sqrt(ux * ux + uy * uy)
      if (sp > 5) {
        ux = (ux / sp) * 5
        uy = (uy / sp) * 5
      }
      const nx = x + ux
      const ny = y + uy
      // Brightness tracks departure from the free stream, so only the curls glow.
      const swirl = p.constrain(Math.sqrt((ux - U0) * (ux - U0) + uy * uy) / 2.4, 0, 1)
      cyan.setAlpha(14 + swirl * 185)
      p.stroke(cyan)
      p.strokeWeight(0.7 + swirl * 0.9)
      p.line(x, y, nx, ny)
      px[i] = nx
      py[i] = ny
      if (nx > p.width + 6 || ny < -6 || ny > p.height + 6 || p.random() < 0.002) {
        px[i] = p.random(-30, 0)
        py[i] = p.random(p.height)
      }
    }

    const orange = p.color(pal.accent)
    orange.setAlpha(170)
    p.noFill()
    p.stroke(orange)
    p.strokeWeight(1.4)
    p.circle(obs, cy, 26)
  }
}
