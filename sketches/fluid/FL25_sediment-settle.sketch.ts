import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Grain {
  x: number
  y: number
  vy: number
  radius: number
  terminal: number
  kind: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const columns = 80
  const deposits: number[][] = []
  const grains: Grain[] = []
  const cellWidth = ctx.width / columns
  const cellHeight = 2.1
  const floor = ctx.height * 0.93

  function reset(grain: Grain, scatter: boolean) {
    grain.x = p.random(ctx.width)
    grain.y = scatter ? p.random(-20, floor - 15) : p.random(-45, -3)
    grain.radius = p.random(1.1, 3.5)
    grain.terminal = 0.18 + grain.radius * grain.radius * 0.095
    grain.vy = scatter ? p.random(grain.terminal) : 0
    grain.kind = grain.radius < 1.9 ? 0 : grain.radius < 2.7 ? 1 : 2
  }

  function seedBed() {
    for (let column = 0; column < columns; column++) {
      const stack = deposits[column]
      stack.length = 0
      const depth = 3 + Math.floor(p.noise(column * 0.12) * 6)
      for (let layer = 0; layer < depth; layer++) stack.push(layer < depth * 0.42 ? 2 : layer < depth * 0.76 ? 1 : 0)
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    for (let column = 0; column < columns; column++) deposits.push([])
    seedBed()
    for (let i = 0; i < 460; i++) {
      const grain = { x: 0, y: 0, vy: 0, radius: 0, terminal: 0, kind: 0 }
      reset(grain, true)
      grains.push(grain)
    }
  }

  p.draw = () => {
    if (p.frameCount % 480 === 0) {
      seedBed()
      for (const grain of grains) reset(grain, true)
    }
    p.background(ctx.palette.ink)
    const f = p.frameCount
    for (const grain of grains) {
      grain.vy += (grain.terminal - grain.vy) * 0.055
      grain.x += (p.noise(grain.x * 0.01, grain.y * 0.008, f * 0.003) - 0.5) * 0.28 / grain.radius
      grain.y += grain.vy
      if (grain.x < 0) grain.x += ctx.width
      if (grain.x >= ctx.width) grain.x -= ctx.width
      const column = Math.min(columns - 1, Math.floor(grain.x / cellWidth))
      const bedY = floor - deposits[column].length * cellHeight
      if (grain.y + grain.radius >= bedY) {
        if (deposits[column].length < 100) deposits[column].push(grain.kind)
        reset(grain, false)
      }
    }

    const fine = p.color(ctx.palette.accent)
    fine.setAlpha(175)
    const medium = p.color(ctx.palette.signal)
    medium.setAlpha(175)
    const coarse = p.color(ctx.palette.dim)
    coarse.setAlpha(205)
    p.noStroke()
    for (let column = 0; column < columns; column++) {
      const stack = deposits[column]
      for (let layer = 0; layer < stack.length; layer++) {
        p.fill(stack[layer] === 0 ? fine : stack[layer] === 1 ? medium : coarse)
        p.rect(column * cellWidth, floor - (layer + 1) * cellHeight, cellWidth + 0.3, cellHeight + 0.3)
      }
    }
    for (const grain of grains) {
      const color = p.color(grain.kind === 0 ? ctx.palette.accent : ctx.palette.signal)
      color.setAlpha(grain.kind === 0 ? 135 : 185)
      p.fill(color)
      p.circle(grain.x, grain.y, grain.radius * 2)
    }
    p.stroke(ctx.palette.dim)
    p.strokeWeight(1)
    p.line(0, floor, ctx.width, floor)
    p.stroke(ctx.palette.signal)
    p.line(0, ctx.height * 0.08, ctx.width, ctx.height * 0.08)
  }
}
