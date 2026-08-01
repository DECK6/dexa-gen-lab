import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Preset { axiom: string; rules: Record<string, string>; ang: number; iter: number }
interface Seg { x1: number; y1: number; x2: number; y2: number; d: number }
interface Turtle { x: number; y: number; a: number; l: number; d: number }

const PRESETS: Preset[] = [
  { axiom: 'X', rules: { X: 'F[+X][-X]FX', F: 'FF' }, ang: 0.44, iter: 5 },
  { axiom: 'F', rules: { F: 'F[+F]F[-F]F' }, ang: 0.4, iter: 4 },
  { axiom: 'X', rules: { X: 'F[-X]F[+X]-X', F: 'FF' }, ang: 0.36, iter: 6 },
  { axiom: 'F', rules: { F: 'FF-[-F+F]+[+F-F]' }, ang: 0.42, iter: 4 },
]
const MAX_STR = 9000
const MAX_SEG = 1200 // per plant — recursion is string-driven, stack depth stays bounded
const PLANTS = 4
const GROW = 10
const HOLD = 70
const FADE = 55

function expand(pre: Preset): string {
  let s = pre.axiom
  for (let i = 0; i < pre.iter && s.length < MAX_STR; i++) {
    let out = ''
    for (const ch of s) out += pre.rules[ch] ?? ch
    s = out
  }
  return s
}

function turtle(p: P5, s: string, ang: number, out: Seg[]): void {
  let st: Turtle = { x: 0, y: 0, a: -p.HALF_PI, l: 1, d: 0 }
  const stack: Turtle[] = []
  for (const ch of s) {
    if (out.length >= MAX_SEG) return
    if (ch === 'F') {
      const nx = st.x + Math.cos(st.a) * st.l
      const ny = st.y + Math.sin(st.a) * st.l
      out.push({ x1: st.x, y1: st.y, x2: nx, y2: ny, d: st.d })
      st.x = nx
      st.y = ny
    } else if (ch === '+') st.a += ang * (0.7 + p.random() * 0.6)
    else if (ch === '-') st.a -= ang * (0.7 + p.random() * 0.6)
    else if (ch === '[') {
      stack.push({ ...st })
      st.l *= 0.82
      st.d += 1
    } else if (ch === ']') {
      const back = stack.pop()
      if (back) st = back
    }
  }
}

function plant(p: P5, h: number, bx: number, by: number): Seg[] {
  const pre = PRESETS[Math.floor(p.random(PRESETS.length))]!
  const local: Seg[] = []
  turtle(p, expand(pre), pre.ang, local)
  let minX = 0
  let maxX = 0
  let minY = 0
  for (const s of local) {
    minX = Math.min(minX, s.x2)
    maxX = Math.max(maxX, s.x2)
    minY = Math.min(minY, s.y2)
  }
  const k = h / Math.max(0.001, -minY)
  const cx = (minX + maxX) * 0.5 * k
  return local.map((s) => ({
    x1: bx + s.x1 * k - cx,
    y1: by + s.y1 * k,
    x2: bx + s.x2 * k - cx,
    y2: by + s.y2 * k,
    d: s.d,
  }))
}

function grove(p: P5): Seg[] {
  const parts: Seg[][] = []
  for (let i = 0; i < PLANTS; i++) {
    const bx = (p.width * (i + 0.5)) / PLANTS + p.random(-24, 24)
    parts.push(plant(p, p.height * p.random(0.5, 0.78), bx, p.height * p.random(0.93, 1.0)))
  }
  let longest = 0
  for (const q of parts) longest = Math.max(longest, q.length)
  const all: Seg[] = []
  for (let i = 0; i < longest; i++) {
    for (const q of parts) {
      const s = q[i]
      if (s) all.push(s)
    }
  }
  return all
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let segs: Seg[] = []
  let cursor = 0
  let phase = 0
  let timer = 0

  const stroke = (s: Seg, i: number) => {
    const tip = s.d >= 4 && i % 9 === 0
    const c = p.color(tip ? pal.accent : pal.signal)
    c.setAlpha(tip ? 170 : 215 - s.d * 20)
    p.stroke(c)
    p.strokeWeight(Math.max(0.6, 3.4 - s.d * 0.5))
    p.line(s.x1, s.y1, s.x2, s.y2)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    segs = grove(p)
  }

  p.draw = () => {
    if (phase === 0) {
      const end = Math.min(segs.length, cursor + GROW)
      for (let i = cursor; i < end; i++) stroke(segs[i]!, i)
      cursor = end
      if (cursor >= segs.length) phase = 1
    } else if (phase === 1) {
      const s = segs[Math.floor(p.random(segs.length))]!
      const c = p.color(s.d >= 4 ? pal.accent : pal.signal)
      c.setAlpha(140)
      p.stroke(c)
      p.strokeWeight(2.4)
      p.point(s.x2, s.y2)
      if (++timer > HOLD) {
        phase = 2
        timer = 0
      }
    } else {
      const veil = p.color(pal.bg)
      veil.setAlpha(14)
      p.noStroke()
      p.fill(veil)
      p.rect(0, 0, p.width, p.height)
      if (++timer > FADE) {
        p.background(pal.bg)
        segs = grove(p)
        cursor = 0
        phase = 0
        timer = 0
      }
    }
  }
}
