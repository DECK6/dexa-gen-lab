import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 96
const CELLS = N * N
const OPEN_PER_FRAME = 92

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  const open = new Uint8Array(CELLS)
  const flags = new Uint8Array(CELLS)
  const flash = new Uint8Array(CELLS)
  const parent = new Int32Array(CELLS)
  const size = new Uint16Array(CELLS)
  const order = new Uint16Array(CELLS)
  const tone = new Uint8Array(12)
  let cursor = 0
  let hitFrame = -1

  const find = (start: number) => {
    let root = start
    while (parent[root] !== root) root = parent[root]
    let node = start
    while (parent[node] !== node) {
      const next = parent[node]
      parent[node] = root
      node = next
    }
    return root
  }

  const unite = (a: number, b: number) => {
    let ra = find(a)
    let rb = find(b)
    if (ra === rb) return ra
    if (size[ra] < size[rb]) [ra, rb] = [rb, ra]
    parent[rb] = ra
    size[ra] += size[rb]
    flags[ra] |= flags[rb]
    return ra
  }

  const reset = () => {
    open.fill(0)
    flags.fill(0)
    flash.fill(0)
    parent.fill(-1)
    size.fill(0)
    for (let i = 0; i < CELLS; i++) order[i] = i
    for (let i = CELLS - 1; i > 0; i--) {
      const j = p.random(i + 1) | 0
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    cursor = 0
    hitFrame = -1
  }

  const addSite = (i: number) => {
    open[i] = 1
    parent[i] = i
    size[i] = 1
    flash[i] = 5
    const x = i % N
    const y = (i / N) | 0
    flags[i] = (y === 0 ? 1 : 0) | (y === N - 1 ? 2 : 0)
    let root = i
    if (x > 0 && open[i - 1] === 1) root = unite(root, i - 1)
    if (x < N - 1 && open[i + 1] === 1) root = unite(root, i + 1)
    if (y > 0 && open[i - N] === 1) root = unite(root, i - N)
    if (y < N - 1 && open[i + N] === 1) root = unite(root, i + N)
    if (flags[find(root)] === 3 && hitFrame < 0) hitFrame = p.frameCount
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    buf = p.createGraphics(N, N)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels
    const colors = [p.color(pal.bg), p.color(pal.dim), p.color(pal.signal), p.color(pal.accent)]
    for (let i = 0; i < colors.length; i++) {
      tone[i * 3] = p.red(colors[i])
      tone[i * 3 + 1] = p.green(colors[i])
      tone[i * 3 + 2] = p.blue(colors[i])
    }
    reset()
  }

  p.draw = () => {
    for (let k = 0; k < OPEN_PER_FRAME && cursor < CELLS; k++) addSite(order[cursor++])
    if (hitFrame >= 0 && p.frameCount - hitFrame > 70) reset()
    for (let i = 0; i < CELLS; i++) {
      const spanning = open[i] === 1 && flags[find(i)] === 3
      const pulse = spanning && ((i + p.frameCount * 2) & 7) < 2
      const s = (flash[i] > 0 ? 3 : pulse ? 3 : spanning ? 2 : open[i] === 1 ? 1 : 0) * 3
      const o = i * 4
      px[o] = tone[s]
      px[o + 1] = tone[s + 1]
      px[o + 2] = tone[s + 2]
      if (flash[i] > 0) flash[i]--
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
