import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const G = 48
const COUNT = 900
const CYCLE = 720

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const fieldX = new Float32Array(G * G)
  const fieldY = new Float32Array(G * G)
  const strength = new Float32Array(G * G)
  const px: number[] = []
  const py: number[] = []
  const heading: number[] = []
  const phase: number[] = []

  const resetField = (cycle: number) => {
    strength.fill(0)
    for (let j = 0; j < G; j++) {
      for (let i = 0; i < G; i++) {
        const index = j * G + i
        const angle = p.noise(i * 0.08, j * 0.08, cycle * 2.1) * p.TWO_PI * 2
        fieldX[index] = Math.cos(angle)
        fieldY[index] = Math.sin(angle)
      }
    }
  }
  const spawn = (i: number) => {
    px[i] = p.random(p.width)
    py[i] = p.random(p.height)
    heading[i] = p.random(p.TWO_PI)
    if (phase[i] === undefined) phase[i] = p.random(p.TWO_PI)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    resetField(0)
    for (let i = 0; i < COUNT; i++) spawn(i)
    p.strokeCap(p.ROUND)
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(18)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)
    if (p.frameCount % CYCLE === 0) {
      resetField(Math.floor(p.frameCount / CYCLE))
      for (let i = 0; i < COUNT; i++) spawn(i)
    }

    const cellW = p.width / G
    const cellH = p.height / G
    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    for (let i = 0; i < COUNT; i++) {
      const x = px[i]!
      const y = py[i]!
      const gx = Math.min(Math.max(Math.floor(x / cellW), 0), G - 1)
      const gy = Math.min(Math.max(Math.floor(y / cellH), 0), G - 1)
      const index = gy * G + gx
      const target = Math.atan2(fieldY[index]!, fieldX[index]!)
      const error = Math.atan2(Math.sin(target - heading[i]!), Math.cos(target - heading[i]!))
      heading[i]! += error * 0.17 + Math.sin(p.frameCount * 0.011 + phase[i]!) * 0.013
      const nx = x + Math.cos(heading[i]!) * 1.65
      const ny = y + Math.sin(heading[i]!) * 1.65
      const learn = 0.025 + strength[index]! * 0.07
      const wx = fieldX[index]! * (1 - learn) + Math.cos(heading[i]!) * learn
      const wy = fieldY[index]! * (1 - learn) + Math.sin(heading[i]!) * learn
      const wm = Math.sqrt(wx * wx + wy * wy) + 1e-6
      fieldX[index] = wx / wm
      fieldY[index] = wy / wm
      strength[index] = Math.min(1, strength[index]! + 0.009)
      const hot = i % 113 === 0
      const col = hot ? orange : cyan
      col.setAlpha((hot ? 70 : 24) + strength[index]! * (hot ? 170 : 115))
      p.stroke(col)
      p.strokeWeight(0.65 + strength[index]! * (hot ? 1.5 : 0.7))
      p.line(x, y, nx, ny)
      px[i] = nx
      py[i] = ny
      if (nx < 0 || nx > p.width || ny < 0 || ny > p.height) spawn(i)
    }

    const dim = p.color(pal.dim)
    dim.setAlpha(90)
    p.stroke(dim)
    p.strokeWeight(0.8)
    for (let j = 2; j < G; j += 4) {
      for (let i = 2; i < G; i += 4) {
        const index = j * G + i
        const x = (i + 0.5) * cellW
        const y = (j + 0.5) * cellH
        const length = 3 + strength[index]! * 7
        p.line(x, y, x + fieldX[index]! * length, y + fieldY[index]! * length)
      }
    }
  }
}
