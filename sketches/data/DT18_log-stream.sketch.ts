import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface LogLine {
  level: 0 | 1 | 2
  code: number
  sequence: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const lines: LogLine[] = []
  const visible = 27
  let sequence = 0

  const makeLine = (): LogLine => {
    const burst = sequence % 42 < 8
    let level: LogLine['level'] = 0
    if (burst && p.random() < 0.64) level = 2
    else if (p.random() < 0.18) level = 1
    return { level, code: Math.floor(p.random(100, 999)), sequence: sequence++ }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
    p.textFont('monospace')
    for (let i = 0; i < visible; i++) lines.push(makeLine())
  }

  p.draw = () => {
    if (p.frameCount % 4 === 0) {
      lines.shift()
      lines.push(makeLine())
    }
    p.background(pal.bg)
    const left = 34
    const top = 52
    const rowH = (ctx.height - top - 34) / visible
    p.fill(pal.ink)
    p.stroke(pal.dim)
    p.strokeWeight(1)
    p.rect(left - 12, top - 24, ctx.width - left * 2 + 24, ctx.height - top - 2)
    p.noStroke()
    p.fill(pal.paper)
    p.textSize(10)
    p.text('SEQ     LVL   SERVICE   EVENT', left, top - 8)
    const labels = ['INFO', 'WARN', 'ERR ']
    const services = ['CORE', 'EDGE', 'CACHE', 'AUTH']
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const y = top + i * rowH
      if (line.level === 2) {
        const burst = p.color(pal.accent)
        burst.setAlpha(55 + Math.sin(p.frameCount * 0.16 + i) * 20)
        p.fill(burst)
        p.rect(left - 5, y - 10, ctx.width - left * 2 + 10, rowH)
      }
      p.fill(line.level === 2 ? pal.accent : line.level === 1 ? pal.paper : pal.signal)
      p.textSize(9)
      const seq = String(line.sequence).padStart(5, '0')
      const service = services[line.sequence % services.length]
      p.text(`${seq}   ${labels[line.level]}  ${service}      E${line.code}`, left, y)
    }
    p.fill(pal.signal)
    p.rect(left - 5, ctx.height - 25, (ctx.width - left * 2 + 10) * ((p.frameCount % 120) / 120), 2)
  }
}
