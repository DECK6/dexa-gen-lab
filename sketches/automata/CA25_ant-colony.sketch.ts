import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 64
const CELLS = N * N
const ANTS = 180
const STEPS = 6
const MAX_PATH = 620
const HOME = 32 * N + 3
const FOOD = 32 * N + N - 4
const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]
const WAY_X = [14, 26, 38, 50, N - 4]
const WAY_Y = [26, 38, 26, 38, 32]

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let buf!: ReturnType<P5['createGraphics']>
  let px!: number[]
  const wall = new Uint8Array(CELLS)
  const pheromone = new Float32Array(CELLS)
  const position = new Int16Array(ANTS)
  const previous = new Int16Array(ANTS)
  const length = new Uint16Array(ANTS)
  const path = new Int16Array(ANTS * MAX_PATH)
  const choices = new Int16Array(4)
  const weights = new Float32Array(4)
  const lut = new Uint8Array(32 * 3)

  const resetAnt = (k: number) => {
    position[k] = HOME
    previous[k] = -1
    length[k] = 1
    path[k * MAX_PATH] = HOME
  }

  const makeWalls = () => {
    for (let x = 0; x < N; x++) wall[x] = wall[(N - 1) * N + x] = 1
    for (let y = 0; y < N; y++) wall[y * N] = wall[y * N + N - 1] = 1
    const xs = [14, 26, 38, 50]
    const gaps = [26, 38, 26, 38]
    for (let b = 0; b < xs.length; b++) for (let y = 1; y < N - 1; y++) {
      if (Math.abs(y - gaps[b]) > 5) wall[y * N + xs[b]] = 1
    }
  }

  const choose = (i: number, prev: number) => {
    const x = i % N
    const y = (i / N) | 0
    let stage = 0
    while (stage < WAY_X.length - 1 && x >= WAY_X[stage]) stage++
    let count = 0
    let total = 0
    for (let d = 0; d < 4; d++) {
      const j = (y + DY[d]) * N + x + DX[d]
      if (wall[j] === 1 || (j === prev && count > 0)) continue
      const dx = j % N - WAY_X[stage]
      const dy = ((j / N) | 0) - WAY_Y[stage]
      const heuristic = Math.exp(-Math.sqrt(dx * dx + dy * dy) * 0.18)
      choices[count] = j
      weights[count] = (0.04 + pheromone[j]) * heuristic
      total += weights[count]
      count++
    }
    if (count === 0) return -1
    let roll = p.random(total)
    for (let c = 0; c < count; c++) {
      roll -= weights[c]
      if (roll <= 0) return choices[c]
    }
    return choices[count - 1]
  }

  const walk = (k: number) => {
    const next = choose(position[k], previous[k])
    if (next < 0) {
      resetAnt(k)
      return
    }
    previous[k] = position[k]
    position[k] = next
    const len = length[k]
    path[k * MAX_PATH + len] = next
    length[k] = len + 1
    if (next === FOOD) {
      const deposit = 100 / length[k]
      for (let s = 0; s < length[k]; s++) {
        const i = path[k * MAX_PATH + s]
        pheromone[i] = Math.min(18, pheromone[i] + deposit)
      }
      resetAnt(k)
    } else if (length[k] >= MAX_PATH) resetAnt(k)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.noSmooth()
    buf = p.createGraphics(N, N)
    buf.pixelDensity(1)
    buf.background(pal.bg)
    buf.loadPixels()
    px = buf.pixels
    const bg = p.color(pal.bg)
    const sg = p.color(pal.signal)
    for (let i = 0; i < 32; i++) {
      const c = p.lerpColor(bg, sg, i / 31)
      lut[i * 3] = p.red(c)
      lut[i * 3 + 1] = p.green(c)
      lut[i * 3 + 2] = p.blue(c)
    }
    makeWalls()
    for (let k = 0; k < ANTS; k++) resetAnt(k)
  }

  p.draw = () => {
    for (let i = 0; i < CELLS; i++) pheromone[i] *= 0.992
    for (let s = 0; s < STEPS; s++) for (let k = 0; k < ANTS; k++) walk(k)
    if (p.frameCount % 1200 === 0) pheromone.fill(0)
    const dm = p.color(pal.dim)
    const ac = p.color(pal.accent)
    for (let i = 0; i < CELLS; i++) {
      const t = Math.min(31, (pheromone[i] * 7) | 0) * 3
      const o = i * 4
      px[o] = wall[i] === 1 ? p.red(dm) : lut[t]
      px[o + 1] = wall[i] === 1 ? p.green(dm) : lut[t + 1]
      px[o + 2] = wall[i] === 1 ? p.blue(dm) : lut[t + 2]
    }
    for (let k = 0; k < ANTS; k++) {
      const o = position[k] * 4
      px[o] = p.red(ac)
      px[o + 1] = p.green(ac)
      px[o + 2] = p.blue(ac)
    }
    for (const i of [HOME, FOOD]) {
      const o = i * 4
      px[o] = p.red(ac)
      px[o + 1] = p.green(ac)
      px[o + 2] = p.blue(ac)
    }
    buf.updatePixels()
    p.image(buf, 0, 0, p.width, p.height)
  }
}
