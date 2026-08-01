import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const CODE: Record<string, string> = {
  A: '.-', B: '-...', D: '-..', E: '.', G: '--.', L: '.-..', N: '-.', X: '-..-',
}
const MSG = 'DEXA GEN LAB'
const UNIT = 5 // frames per morse time unit

interface Key {
  at: number
  dur: number
  dash: boolean
  ci: number
}

interface Ring {
  r: number
  a: number
  dash: boolean
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const keys: Key[] = []
  const rings: Ring[] = []
  let total = 0
  let lit = 0
  let cur = 0

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)

    let at = 0
    for (let ci = 0; ci < MSG.length; ci++) {
      const sym = CODE[MSG.charAt(ci)]
      if (!sym) {
        at += 4 * UNIT // word gap
        continue
      }
      for (let s = 0; s < sym.length; s++) {
        const dash = sym.charAt(s) === '-'
        const dur = (dash ? 3 : 1) * UNIT
        keys.push({ at, dur, dash, ci })
        at += dur + UNIT // symbol + intra-character gap
      }
      at += 2 * UNIT // letter gap
    }
    total = at + 8 * UNIT
  }

  p.draw = () => {
    p.background(pal.bg)
    const clock = p.frameCount % total
    const cx = p.width * 0.5
    const cy = p.height * 0.46

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]!
      if (k.at === clock) {
        rings.push({ r: p.width * 0.03, a: 255, dash: k.dash })
        lit = k.dur
        cur = k.ci
      }
    }
    if (lit > 0) lit--

    p.noFill()
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i]!
      r.r += r.dash ? 3.4 : 2.2
      r.a *= r.dash ? 0.978 : 0.968
      if (r.a < 3 || r.r > p.width) {
        rings.splice(i, 1)
        continue
      }
      const c = p.color(pal.signal)
      c.setAlpha(r.a)
      p.stroke(c)
      p.strokeWeight(r.dash ? 2.4 : 1)
      p.circle(cx, cy, r.r * 2)
    }

    // keyed core
    p.noStroke()
    const core = p.color(lit > 0 ? pal.accent : pal.dim)
    core.setAlpha(lit > 0 ? 235 : 90)
    p.fill(core)
    p.circle(cx, cy, p.width * (lit > 0 ? 0.05 : 0.03))

    // current letter + its pattern
    const ch = MSG.charAt(cur)
    const sym = CODE[ch] ?? ''
    const face = p.color(pal.signal)
    face.setAlpha(60)
    p.fill(face)
    p.textSize(p.width * 0.2)
    p.text(ch, cx, cy)
    const patt = p.color(pal.accent)
    patt.setAlpha(200)
    p.fill(patt)
    p.textSize(p.width * 0.045)
    p.text(sym, cx, cy + p.height * 0.16)

    // message tape
    p.textSize(p.width * 0.038)
    for (let i = 0; i < MSG.length; i++) {
      const c = p.color(i === cur ? pal.accent : pal.signal)
      c.setAlpha(i === cur ? 240 : i < cur ? 120 : 55)
      p.fill(c)
      p.text(MSG.charAt(i), p.width * 0.5 + (i - (MSG.length - 1) * 0.5) * p.width * 0.06, p.height * 0.9)
    }
  }
}
