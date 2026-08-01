import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const ORDER = 12
const N = 1 << ORDER // 4096 segments — iterative, no recursion
const PULSE = 220 // segments lit by the travelling accent pulse

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const turns = new Uint8Array(N)
  const xs = new Float32Array(N + 1)
  const ys = new Float32Array(N + 1)
  let spin = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    // i-th fold direction of the regular paperfolding sequence.
    for (let i = 1; i <= N; i++) turns[i - 1] = (((i & -i) << 1) & i) !== 0 ? 1 : 0
    spin = p.random(p.TWO_PI)
    p.noFill()
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(44)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    p.noFill()

    // Fold angle sweeps 0 (straight ribbon) to 90deg (full dragon) and back.
    const th = p.HALF_PI * (0.5 - 0.5 * Math.cos(p.frameCount * 0.0055))
    let a = spin + p.frameCount * 0.0016
    let x = 0
    let y = 0
    let minX = 0
    let maxX = 0
    let minY = 0
    let maxY = 0
    for (let i = 0; i < N; i++) {
      xs[i] = x
      ys[i] = y
      x += Math.cos(a)
      y += Math.sin(a)
      a += turns[i] ? th : -th
      if (x < minX) minX = x
      else if (x > maxX) maxX = x
      if (y < minY) minY = y
      else if (y > maxY) maxY = y
    }
    xs[N] = x
    ys[N] = y

    const k = Math.min(
      (p.width * 0.86) / Math.max(maxX - minX, 1),
      (p.height * 0.86) / Math.max(maxY - minY, 1),
    )
    const ox = p.width / 2 - ((minX + maxX) / 2) * k
    const oy = p.height / 2 - ((minY + maxY) / 2) * k

    const body = p.color(pal.signal)
    body.setAlpha(150)
    p.stroke(body)
    p.strokeWeight(1)
    p.beginShape()
    for (let i = 0; i <= N; i++) p.vertex(ox + xs[i]! * k, oy + ys[i]! * k)
    p.endShape()

    // A bright pulse runs along the curve so the fold reads directionally.
    const head = (p.frameCount * 7) % (N - PULSE)
    const hot = p.color(pal.accent)
    hot.setAlpha(210)
    p.stroke(hot)
    p.strokeWeight(1.6)
    p.beginShape()
    for (let i = head; i < head + PULSE; i++) p.vertex(ox + xs[i]! * k, oy + ys[i]! * k)
    p.endShape()
  }
}
