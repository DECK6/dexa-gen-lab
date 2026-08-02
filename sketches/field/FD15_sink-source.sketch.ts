import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const PAIRS = 2
const COUNT = 820
const CYCLE = 360

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const px: number[] = []
  const py: number[] = []
  const owner: number[] = []
  const sx = new Float32Array(PAIRS)
  const sy = new Float32Array(PAIRS)
  const dx = new Float32Array(PAIRS)
  const dy = new Float32Array(PAIRS)

  const updateSites = (frame: number) => {
    const turn = frame * 0.006
    for (let k = 0; k < PAIRS; k++) {
      const cx = p.width * (k === 0 ? 0.32 : 0.68)
      const cy = p.height * (0.5 + Math.sin(turn * 0.6 + k * p.PI) * 0.18)
      const a = turn * (k === 0 ? 1 : -1) + k * 1.4
      const sep = Math.min(p.width, p.height) * 0.11
      sx[k] = cx + Math.cos(a) * sep
      sy[k] = cy + Math.sin(a) * sep
      dx[k] = cx - Math.cos(a) * sep
      dy[k] = cy - Math.sin(a) * sep
    }
  }
  const spawn = (i: number) => {
    const k = i % PAIRS
    const a = p.random(p.TWO_PI)
    const r = p.random(3, 22)
    owner[i] = k
    px[i] = sx[k]! + Math.cos(a) * r
    py[i] = sy[k]! + Math.sin(a) * r
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    updateSites(0)
    for (let i = 0; i < COUNT; i++) spawn(i)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(17)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    updateSites(p.frameCount)
    if (p.frameCount % CYCLE === 0) for (let i = 0; i < COUNT; i++) spawn(i)

    const pulse = 0.02 + Math.sin((p.frameCount % CYCLE) / CYCLE * p.PI) ** 2 * 0.98
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    for (let i = 0; i < COUNT; i++) {
      const k = owner[i]!
      const x = px[i]!
      const y = py[i]!
      const rsx = x - sx[k]!
      const rsy = y - sy[k]!
      const rdx = dx[k]! - x
      const rdy = dy[k]! - y
      const sr2 = rsx * rsx + rsy * rsy + 180
      const dr2 = rdx * rdx + rdy * rdy + 180
      let ux = (rsx / sr2 + rdx / dr2) * 170 * pulse
      let uy = (rsy / sr2 + rdy / dr2) * 170 * pulse
      const speed = Math.sqrt(ux * ux + uy * uy)
      if (speed > 4.2) {
        ux = ux / speed * 4.2
        uy = uy / speed * 4.2
      }
      px[i] = x + ux
      py[i] = y + uy
      cyan.setAlpha(38 + pulse * 105)
      p.stroke(cyan)
      p.strokeWeight(0.8 + pulse * 0.5)
      p.line(x, y, px[i]!, py[i]!)
      if (dr2 < 250 || px[i]! < 0 || px[i]! > p.width || py[i]! < 0 || py[i]! > p.height) spawn(i)
    }

    p.noFill()
    p.strokeWeight(1.4)
    for (let k = 0; k < PAIRS; k++) {
      cyan.setAlpha(pulse * 210)
      orange.setAlpha(pulse * 235)
      p.stroke(cyan)
      p.circle(sx[k]!, sy[k]!, 12 + pulse * 10)
      p.stroke(orange)
      p.circle(dx[k]!, dy[k]!, 12 - pulse * 5)
    }
  }
}
