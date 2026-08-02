import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SEGMENTS = [
  [-0.28, -0.52, 0.28, -0.52], [0.32, -0.48, 0.32, -0.04],
  [0.32, 0.04, 0.32, 0.48], [-0.28, 0.52, 0.28, 0.52],
  [-0.32, 0.04, -0.32, 0.48], [-0.32, -0.48, -0.32, -0.04],
  [-0.28, 0, 0.28, 0],
]
const MAP: Record<string, string> = {
  '0': '1111110', '1': '0110000', '2': '1101101', '3': '1111001', '4': '0110011',
  '5': '1011011', '6': '1011111', '7': '1110000', '8': '1111111', '9': '1111011',
}
const PAGES = ['270824', '640060', '231590']
const CYCLE = 240

interface Fragment {
  dx: number
  dy: number
  rot: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const fragments: Fragment[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < 42; i++) {
      fragments.push({
        dx: p.random(-p.width * 0.28, p.width * 0.28),
        dy: p.random(-p.height * 0.3, p.height * 0.3),
        rot: p.random(-p.PI, p.PI),
      })
    }
    p.noFill()
  }

  p.draw = () => {
    p.background(pal.bg)
    const cycle = Math.floor((p.frameCount - 1) / CYCLE)
    const phase = ((p.frameCount - 1) % CYCLE) / CYCLE
    const x = phase < 0.25 ? phase / 0.25 : phase < 0.66 ? 1 : 1 - (phase - 0.66) / 0.34
    const k = x * x * (3 - 2 * x)
    const text = PAGES[cycle % PAGES.length]!
    const digitW = p.width * 0.125
    const left = p.width * 0.5 - (text.length - 1) * digitW * 0.5
    const cy = p.height * 0.5

    for (let digit = 0; digit < text.length; digit++) {
      const bits = MAP[text.charAt(digit)]!
      for (let s = 0; s < SEGMENTS.length; s++) {
        const seg = SEGMENTS[s]!
        const fragment = fragments[digit * 7 + s]!
        const active = bits.charAt(s) === '1'
        const c = p.color(active ? (digit + s) % 13 === 0 ? pal.accent : pal.signal : pal.dim)
        const pulse = Math.sin(p.frameCount * 0.05 + digit * 0.7 + s * 0.4) ** 2
        c.setAlpha(active ? 80 + k * 145 + pulse * 30 : 25 + k * 25)
        p.stroke(c)
        p.strokeWeight(digitW * (active ? 0.075 : 0.035))
        p.push()
        p.translate(left + digit * digitW + fragment.dx * (1 - k), cy + fragment.dy * (1 - k))
        p.rotate(fragment.rot * (1 - k))
        p.line(seg[0]! * digitW, seg[1]! * digitW * 1.65, seg[2]! * digitW, seg[3]! * digitW * 1.65)
        p.pop()
      }
    }

    p.noStroke()
    const rail = p.color(pal.dim)
    rail.setAlpha(95)
    p.fill(rail)
    p.rect(p.width * 0.12, p.height * 0.82, p.width * 0.76, 2)
    p.fill(pal.accent)
    p.rect(p.width * (0.12 + 0.73 * ((p.frameCount % 120) / 120)), p.height * 0.81, p.width * 0.03, 3)
  }
}
