import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface FlowNode {
  y: number
  value: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  let scale = 1

  const layout = (values: number[]): FlowNode[] => {
    const gap = 18
    const total = values.reduce((sum, value) => sum + value, 0) * scale + gap * (values.length - 1)
    let y = (p.height - total) / 2
    return values.map((value) => {
      const node = { y: y + value * scale / 2, value }
      y += value * scale + gap
      return node
    })
  }

  const links = (x1: number, x2: number, left: FlowNode[], right: FlowNode[], flows: number[][]): void => {
    const leftY = left.map((node) => node.y - node.value * scale / 2)
    const rightY = right.map((node) => node.y - node.value * scale / 2)
    for (let i = 0; i < flows.length; i++) {
      for (let j = 0; j < flows[i].length; j++) {
        const width = flows[i][j] * scale
        const y1 = leftY[i] + width / 2
        const y2 = rightY[j] + width / 2
        p.noFill()
        p.stroke(pal.ink)
        p.strokeWeight(width + 4)
        p.bezier(x1, y1, p.lerp(x1, x2, 0.42), y1, p.lerp(x1, x2, 0.58), y2, x2, y2)
        const ribbon = p.color((i + j) % 5 === 3 ? pal.accent : pal.signal)
        ribbon.setAlpha(125 + ((i * 3 + j) % 3) * 30)
        p.stroke(ribbon)
        p.strokeWeight(Math.max(1, width))
        p.bezier(x1, y1, p.lerp(x1, x2, 0.42), y1, p.lerp(x1, x2, 0.58), y2, x2, y2)
        leftY[i] += width
        rightY[j] += width
      }
    }
  }

  const nodes = (x: number, values: FlowNode[]): void => {
    p.noStroke()
    p.fill(pal.paper)
    for (const node of values) p.rect(x - 6, node.y - node.value * scale / 2, 12, node.value * scale, 2)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    scale = Math.min(ctx.width, ctx.height) / 260
  }

  p.draw = () => {
    p.background(pal.bg)
    const t = p.frameCount * 0.018
    const a = Math.sin(t) * 5
    const b = Math.sin(t * 0.73 + 2) * 4
    const first = [[24 + a, 18 - a * 0.4, 13 - a * 0.6], [12 - b * 0.5, 19 + b, 14 - b * 0.5]]
    const sourceValues = first.map((row) => row.reduce((sum, value) => sum + value, 0))
    const middleValues = first[0].map((_, i) => first[0][i] + first[1][i])
    const second = middleValues.map((value, i) => [value * [0.72, 0.46, 0.24][i], value * [0.28, 0.54, 0.76][i]])
    const targetValues = [0, 1].map((j) => second.reduce((sum, row) => sum + row[j], 0))
    const source = layout(sourceValues)
    const middle = layout(middleValues)
    const target = layout(targetValues)
    const xs = [ctx.width * 0.12, ctx.width * 0.5, ctx.width * 0.88]
    const grid = p.color(pal.dim)
    grid.setAlpha(45)
    p.stroke(grid)
    p.strokeWeight(1)
    for (let y = 32; y < ctx.height; y += 32) p.line(24, y, ctx.width - 24, y)
    links(xs[0] + 6, xs[1] - 6, source, middle, first)
    links(xs[1] + 6, xs[2] - 6, middle, target, second)
    nodes(xs[0], source)
    nodes(xs[1], middle)
    nodes(xs[2], target)
  }
}
