import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const RIBBONS = 26
const NODES = 34
const SEG = 11
const DRIFT = 0.6
const SIDES = [1, -1]

interface Ribbon {
  x: number
  y: number
  w: number
  lane: number
  hot: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const ribbons: Ribbon[] = []
  const xs = new Float32Array(NODES)
  const ys = new Float32Array(NODES)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < RIBBONS; i++) {
      // One lane per ribbon keeps the bundle spread over the full height.
      ribbons.push({
        x: p.random(-60, p.width),
        y: ((i + 0.5) / RIBBONS) * p.height + p.random(-18, 18),
        w: p.random(3, 11),
        lane: i,
        hot: i % 7 === 3,
      })
    }
  }

  // Offset node k sideways by `side * halfWidth`, using the local tangent.
  const shoulder = (k: number, side: number, half: number) => {
    const k1 = k < NODES - 1 ? k + 1 : k
    const k0 = k < NODES - 1 ? k : k - 1
    const tx = xs[k1]! - xs[k0]!
    const ty = ys[k1]! - ys[k0]!
    const m = Math.sqrt(tx * tx + ty * ty) + 1e-6
    const taper = Math.sin((k / (NODES - 1)) * p.PI) * half
    p.vertex(xs[k]! - (ty / m) * taper * side, ys[k]! + (tx / m) * taper * side)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(30)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const z = p.frameCount * 0.0016
    const cool = p.color(pal.signal)
    const hot = p.color(pal.accent)

    for (let r = 0; r < ribbons.length; r++) {
      const rb = ribbons[r]!
      rb.x += DRIFT
      if (rb.x > p.width + 40) {
        rb.x = -50
        rb.y = ((rb.lane + 0.5) / RIBBONS) * p.height + p.random(-18, 18)
        rb.w = p.random(3, 11)
      }

      // Integrate a streamline; wind blows right, noise bends it.
      let x = rb.x
      let y = rb.y
      for (let k = 0; k < NODES; k++) {
        xs[k] = x
        ys[k] = y
        const a = (p.noise(x * 0.0024, y * 0.0024, z) - 0.5) * p.TWO_PI * 0.95
        const dx = Math.cos(a) * 0.55 + 1
        const dy = Math.sin(a) * 0.8
        const m = Math.sqrt(dx * dx + dy * dy)
        x += (dx / m) * SEG
        y += (dy / m) * SEG
      }

      const col = rb.hot ? hot : cool
      col.setAlpha(rb.hot ? 18 : 13)
      p.noStroke()
      p.fill(col)
      p.beginShape()
      for (let k = 0; k < NODES; k++) shoulder(k, 1, rb.w)
      for (let k = NODES - 1; k >= 0; k--) shoulder(k, -1, rb.w)
      p.endShape(p.CLOSE)

      p.noFill()
      p.strokeWeight(1)
      for (const side of SIDES) {
        col.setAlpha(side > 0 ? (rb.hot ? 155 : 108) : rb.hot ? 90 : 62)
        p.stroke(col)
        p.beginShape()
        for (let k = 0; k < NODES; k++) shoulder(k, side, rb.w)
        p.endShape()
      }
    }
  }
}
