import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const PAD = 26
const MIN_SIDE = 44
const INTERVAL = 6
const DRAW_FRAMES = 16
const HOLD_FRAMES = 120

interface Rect {
  x: number
  y: number
  w: number
  h: number
}
interface Cut {
  x1: number
  y1: number
  x2: number
  y2: number
  birth: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let queue: Rect[] = []
  let cuts: Cut[] = []
  let leaves: Rect[] = []
  let phase: 'split' | 'hold' | 'fade' = 'split'
  let phaseFrame = 0
  let alpha = 1

  const reset = () => {
    queue = [{ x: PAD, y: PAD, w: p.width - PAD * 2, h: p.height - PAD * 2 }]
    cuts = []
    leaves = []
  }

  const split = () => {
    const r = queue.shift()
    if (!r) return
    const vertical = r.w > r.h * 1.05 || (p.abs(r.w - r.h) < 1 && p.random() < 0.5)
    const ratio = (2 + p.floor(p.random(5))) / 8
    const hot = p.random() < 0.12
    const a: Rect = vertical
      ? { x: r.x, y: r.y, w: r.w * ratio, h: r.h }
      : { x: r.x, y: r.y, w: r.w, h: r.h * ratio }
    const b: Rect = vertical
      ? { x: r.x + a.w, y: r.y, w: r.w - a.w, h: r.h }
      : { x: r.x, y: r.y + a.h, w: r.w, h: r.h - a.h }

    cuts.push(
      vertical
        ? { x1: r.x + a.w, y1: r.y, x2: r.x + a.w, y2: r.y + r.h, birth: p.frameCount, hot }
        : { x1: r.x, y1: r.y + a.h, x2: r.x + r.w, y2: r.y + a.h, birth: p.frameCount, hot },
    )
    for (const child of [a, b]) {
      if (p.min(child.w, child.h) > MIN_SIDE) queue.push(child)
      else leaves.push(child)
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noFill()
    reset()
  }

  p.draw = () => {
    p.background(pal.bg)
    phaseFrame++

    if (phase === 'split') {
      if (p.frameCount % INTERVAL === 0) split()
      if (queue.length === 0) {
        phase = 'hold'
        phaseFrame = 0
      }
    } else if (phase === 'hold' && phaseFrame > HOLD_FRAMES) {
      phase = 'fade'
      phaseFrame = 0
    } else if (phase === 'fade') {
      alpha = p.max(0, 1 - phaseFrame / 40)
      if (alpha <= 0) {
        reset()
        alpha = 1
        phase = 'split'
        phaseFrame = 0
      }
    }

    const frame = p.color(pal.dim)
    frame.setAlpha(190 * alpha)
    p.stroke(frame)
    p.strokeWeight(1)
    p.rect(PAD, PAD, p.width - PAD * 2, p.height - PAD * 2)

    for (const c of cuts) {
      const prog = p.constrain((p.frameCount - c.birth) / DRAW_FRAMES, 0, 1)
      const e = 1 - (1 - prog) * (1 - prog)
      const mx = (c.x1 + c.x2) / 2
      const my = (c.y1 + c.y2) / 2
      const breath = 14 * p.sin(p.frameCount * 0.04 + (c.x1 + c.y1) * 0.012)
      const line = p.color(c.hot ? pal.accent : pal.signal)
      line.setAlpha(p.min(255, (c.hot ? 205 : 128) + breath) * alpha)
      p.stroke(line)
      p.strokeWeight(c.hot ? 1.6 : 1.1)
      p.line(
        p.lerp(mx, c.x1, e),
        p.lerp(my, c.y1, e),
        p.lerp(mx, c.x2, e),
        p.lerp(my, c.y2, e),
      )
    }

    // terminal cells get a corner tick — the measured, finished look
    const tick = p.color(pal.paper)
    tick.setAlpha(80 * alpha)
    p.stroke(tick)
    p.strokeWeight(1)
    for (const l of leaves) {
      p.line(l.x + 5, l.y + 5, l.x + 13, l.y + 5)
      p.line(l.x + 5, l.y + 5, l.x + 5, l.y + 13)
    }
  }
}
