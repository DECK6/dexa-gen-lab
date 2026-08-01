import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Node {
  len: number
  ang: number
  id: number
  kids: Node[]
}

const MAX_DEPTH = 9 // 2^10-1 = 1023 segments, recursion stays shallow
const LEAF_ACCENT = 6 // 1 in N leaves burns accent

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let root!: Node
  let ids = 0

  const build = (len: number, ang: number, depth: number): Node => {
    const node: Node = { len, ang, id: ids++, kids: [] }
    if (depth < MAX_DEPTH) {
      const spread = 0.34 + p.random(-0.08, 0.16)
      const shrink = 0.73 + p.random(-0.05, 0.06)
      node.kids.push(build(len * shrink, -spread * p.random(0.65, 1.35), depth + 1))
      node.kids.push(build(len * shrink, spread * p.random(0.65, 1.35), depth + 1))
    }
    return node
  }

  const limb = (n: Node, x: number, y: number, base: number, depth: number, gust: number) => {
    // Thin high branches bend far more than the trunk. Deflection compounds down
    // the path, so the per-level term stays small.
    const flex = 0.004 + 0.001 * depth * depth
    const local = p.noise(n.id * 0.09, p.frameCount * 0.011) - 0.5
    const a = base + n.ang + gust * flex + local * flex * 1.6
    const nx = x + Math.cos(a) * n.len
    const ny = y + Math.sin(a) * n.len

    const c = p.color(pal.signal)
    c.setAlpha(120 + depth * 12)
    p.stroke(c)
    p.strokeWeight(Math.max(0.7, (MAX_DEPTH - depth) * 0.86))
    p.line(x, y, nx, ny)

    if (n.kids.length === 0) {
      const leaf = p.color(n.id % LEAF_ACCENT === 0 ? pal.accent : pal.signal)
      leaf.setAlpha(n.id % LEAF_ACCENT === 0 ? 210 : 130)
      p.stroke(leaf)
      p.strokeWeight(2.2)
      p.point(nx, ny)
      return
    }
    for (const k of n.kids) limb(k, nx, ny, a, depth + 1, gust)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    root = build(p.height * 0.205, 0, 0)
  }

  p.draw = () => {
    const fade = p.color(pal.bg)
    fade.setAlpha(120)
    p.noStroke()
    p.fill(fade)
    p.rect(0, 0, p.width, p.height)

    // Slow gusts layered with a faster flutter.
    const gust =
      (p.noise(p.frameCount * 0.0055) - 0.5) * 3.4 + (p.noise(90.1, p.frameCount * 0.021) - 0.5) * 1.1
    limb(root, p.width / 2, p.height * 0.98, -p.HALF_PI, 0, gust)
  }
}
