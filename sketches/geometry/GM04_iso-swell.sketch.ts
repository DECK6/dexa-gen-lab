import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 12
const MAX_LIFT = 46

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let tw = 0
  let th = 0
  const jitter: number[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    tw = p.width / (2 * (N + 1))
    th = tw * 0.5
    for (let i = 0; i < N * N; i++) jitter.push(p.random(p.TWO_PI))
  }

  const face = (pts: number[][], fillCol: P5.Color, strokeCol: P5.Color) => {
    p.fill(fillCol)
    p.stroke(strokeCol)
    p.beginShape()
    for (const v of pts) p.vertex(v[0]!, v[1]!)
    p.endShape(p.CLOSE)
  }

  p.draw = () => {
    p.background(pal.bg)
    p.strokeWeight(1)
    const t = p.frameCount * 0.018
    const ox = p.width / 2
    const oy = (p.height - (2 * N * th + MAX_LIFT)) / 2 + MAX_LIFT

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const i = r * N + c
        const d = p.dist(c, r, (N - 1) / 2, (N - 1) / 2)
        const wave = p.sin(t - d * 0.62 + jitter[i]! * 0.12)
        const n = p.noise(c * 0.22, r * 0.22, t * 0.15)
        const h = (wave * 0.6 + 0.5) * MAX_LIFT * (0.45 + n * 0.9)

        const sx = ox + (c - r) * tw
        const sy = oy + (c + r) * th - h
        const hot = wave > 0.88

        const side = p.color(pal.ink)
        side.setAlpha(235)
        const rim = p.color(pal.signal)
        rim.setAlpha(70 + wave * 55)

        // left / right walls, then the cap
        face(
          [
            [sx - tw, sy + th],
            [sx, sy + th * 2],
            [sx, sy + th * 2 + h],
            [sx - tw, sy + th + h],
          ],
          side,
          rim,
        )
        face(
          [
            [sx + tw, sy + th],
            [sx, sy + th * 2],
            [sx, sy + th * 2 + h],
            [sx + tw, sy + th + h],
          ],
          side,
          rim,
        )

        const cap = p.color(pal.bg)
        cap.setAlpha(215)
        const capRim = p.color(hot ? pal.accent : pal.signal)
        capRim.setAlpha(hot ? 235 : 120 + wave * 80)
        face(
          [
            [sx, sy],
            [sx + tw, sy + th],
            [sx, sy + th * 2],
            [sx - tw, sy + th],
          ],
          cap,
          capRim,
        )
      }
    }
  }
}
