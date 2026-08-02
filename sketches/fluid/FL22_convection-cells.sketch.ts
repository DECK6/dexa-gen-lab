import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Cell {
  x: number
  y: number
  spin: number
}

interface Tracer {
  cell: number
  angle: number
  radius: number
  phase: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const cells: Cell[] = []
  const tracers: Tracer[] = []
  const radius = ctx.width * 0.066

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    const dx = radius * 1.5
    const dy = radius * Math.sqrt(3)
    let row = 0
    for (let y = radius * 1.25; y < ctx.height - radius; y += dy) {
      for (let x = radius * 1.2 + (row % 2) * dx * 0.5; x < ctx.width - radius; x += dx) {
        cells.push({ x, y, spin: (cells.length + row) % 2 === 0 ? 1 : -1 })
      }
      row++
    }
    for (let cell = 0; cell < cells.length; cell++) {
      for (let i = 0; i < 7; i++) {
        tracers.push({ cell, angle: p.random(p.TWO_PI), radius: p.random(radius * 0.25, radius * 0.72), phase: p.random(p.TWO_PI) })
      }
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const f = p.frameCount
    p.noFill()
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const outline = p.color(i % 9 === 0 ? ctx.palette.accent : ctx.palette.dim)
      outline.setAlpha(i % 9 === 0 ? 145 : 125)
      p.stroke(outline)
      p.strokeWeight(1)
      p.beginShape()
      for (let k = 0; k < 6; k++) {
        const angle = k * p.TWO_PI / 6
        p.vertex(cell.x + Math.cos(angle) * radius, cell.y + Math.sin(angle) * radius)
      }
      p.endShape(p.CLOSE)
      const core = p.color(ctx.palette.accent)
      core.setAlpha(115 + Math.sin(f * 0.035 + i) * 45)
      p.noStroke()
      p.fill(core)
      p.circle(cell.x, cell.y, 4.5)
      p.noFill()
    }

    const flow = p.color(ctx.palette.signal)
    flow.setAlpha(185)
    p.stroke(flow)
    p.strokeWeight(1.25)
    for (const tracer of tracers) {
      const cell = cells[tracer.cell]
      tracer.angle += cell.spin * (0.018 + Math.sin(f * 0.025 + tracer.phase) * 0.004)
      const breathing = tracer.radius * (0.88 + Math.sin(f * 0.022 + tracer.phase) * 0.12)
      const x = cell.x + Math.cos(tracer.angle) * breathing
      const y = cell.y + Math.sin(tracer.angle) * breathing * 0.78
      const back = tracer.angle - cell.spin * 0.12
      p.line(x, y, cell.x + Math.cos(back) * breathing, cell.y + Math.sin(back) * breathing * 0.78)
    }
  }
}
