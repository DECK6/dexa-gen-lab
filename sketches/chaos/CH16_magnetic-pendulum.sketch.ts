import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SIZE = 112
const ROWS = 4

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let pixels!: number[]
  const labels = new Int8Array(SIZE * SIZE)
  const lut = new Uint8Array(16)
  let row = 0
  let phase = 0

  const magnet = (i: number) => {
    const a = phase + i * p.TWO_PI / 3
    return { x: 0.72 * Math.cos(a), y: 0.72 * Math.sin(a) }
  }

  const classify = (sx: number, sy: number) => {
    let x = sx
    let y = sy
    let vx = 0
    let vy = 0
    for (let n = 0; n < 150; n++) {
      let ax = -0.32 * x - 0.2 * vx
      let ay = -0.32 * y - 0.2 * vy
      for (let i = 0; i < 3; i++) {
        const m = magnet(i)
        const dx = m.x - x
        const dy = m.y - y
        const d2 = dx * dx + dy * dy + 0.035
        const pull = 0.075 / (d2 * Math.sqrt(d2))
        ax += dx * pull
        ay += dy * pull
      }
      vx += ax * 0.07
      vy += ay * 0.07
      x += vx * 0.07
      y += vy * 0.07
    }
    let best = 0
    let dist = Infinity
    for (let i = 0; i < 3; i++) {
      const m = magnet(i)
      const d = (m.x - x) ** 2 + (m.y - y) ** 2
      if (d < dist) {
        dist = d
        best = i
      }
    }
    return best
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    p.noSmooth()
    buf = p.createGraphics(SIZE, SIZE)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    pixels = buf.pixels
    const colors = [p.color(pal.signal), p.color(pal.dim), p.color(pal.signal), p.color(pal.accent)]
    for (let i = 0; i < colors.length; i++) {
      lut[i * 4] = p.red(colors[i])
      lut[i * 4 + 1] = p.green(colors[i])
      lut[i * 4 + 2] = p.blue(colors[i])
      lut[i * 4 + 3] = i === 3 ? 235 : i === 2 ? 175 : 115
    }
    labels.fill(-1)
  }

  p.draw = () => {
    for (let pass = 0; pass < ROWS && row < SIZE; pass++, row++) {
      for (let x = 0; x < SIZE; x++) {
        const label = classify((x / (SIZE - 1) - 0.5) * 2.8, (row / (SIZE - 1) - 0.5) * 2.8)
        const i = row * SIZE + x
        labels[i] = label
        const edge = (x > 0 && labels[i - 1] !== label) || (row > 0 && labels[i - SIZE] !== label)
        const src = (edge ? 3 : label) * 4
        const dst = i * 4
        pixels[dst] = lut[src]
        pixels[dst + 1] = lut[src + 1]
        pixels[dst + 2] = lut[src + 2]
        pixels[dst + 3] = lut[src + 3]
      }
    }
    buf.updatePixels()
    p.background(pal.bg)
    p.image(buf, 0, 0, p.width, p.height)
    for (let i = 0; i < 3; i++) {
      const m = magnet(i)
      p.noFill()
      p.stroke(i === 0 ? pal.accent : pal.paper)
      p.strokeWeight(1.5)
      p.circle(p.width * (0.5 + m.x / 2.8), p.height * (0.5 + m.y / 2.8), 8)
    }
    if (row >= SIZE) {
      row = 0
      phase += 0.14
      labels.fill(-1)
      buf.background(pal.bg)
      buf.loadPixels()
      pixels = buf.pixels
    }
  }
}
