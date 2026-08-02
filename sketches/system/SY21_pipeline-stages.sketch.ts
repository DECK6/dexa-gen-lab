import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Instruction { id: number; src: number; dst: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const stages: Array<Instruction | null> = [null, null, null, null, null]
  const labels = ['FETCH', 'DECODE', 'EXEC', 'MEM', 'WRITE']
  let nextId = 1
  let stalled = false

  const issue = (): Instruction => {
    const dst = p.floor(p.random(8))
    const dependency = p.random() < 0.52 && stages[1] ? stages[1]!.dst : p.floor(p.random(8))
    return { id: nextId++, src: dependency, dst }
  }

  const tick = () => {
    const decode = stages[1]
    stalled = decode !== null && [stages[2], stages[3]].some((older) => older !== null && older.dst === decode.src)
    stages[4] = stages[3]
    stages[3] = stages[2]
    if (stalled) stages[2] = null
    else {
      stages[2] = stages[1]
      stages[1] = stages[0]
      stages[0] = issue()
    }
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < 5; i++) tick()
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    if (p.frameCount % 9 === 0) tick()
    const xs = [82, 201, 320, 439, 558]
    const top = 115
    const bottom = 475
    for (let i = 0; i < stages.length; i++) {
      const x = xs[i]!
      const hot = stalled && i < 2
      p.noFill(); p.stroke(hot ? ctx.palette.accent : ctx.palette.signal); p.strokeWeight(hot ? 2.5 : 1)
      p.rect(x - 47, top, 94, bottom - top, 4)
      p.noStroke(); p.fill(ctx.palette.paper); p.textAlign(p.CENTER); p.textSize(10); p.text(labels[i]!, x, top - 17)
      const instruction = stages[i]
      if (instruction) {
        const pulse = Math.sin((p.frameCount % 9) / 9 * Math.PI)
        p.fill(i === 2 ? ctx.palette.accent : ctx.palette.signal)
        p.rect(x - 35, 244 - pulse * 8, 70, 78, 4)
        p.fill(ctx.palette.ink); p.textSize(12); p.text(`I${instruction.id}`, x, 273 - pulse * 8)
        p.textSize(9); p.text(`R${instruction.src}→R${instruction.dst}`, x, 296 - pulse * 8)
      }
      if (i < stages.length - 1) {
        p.stroke(ctx.palette.dim); p.line(x + 48, 283, xs[i + 1]! - 48, 283)
      }
    }
    if (stalled) {
      p.noStroke(); p.fill(ctx.palette.accent); p.textAlign(p.CENTER); p.textSize(13); p.text('DATA HAZARD / STALL', p.width / 2, 535)
      for (let i = 0; i < 5; i++) p.rect(128 + i * 82, 555, 48, 5 + Math.sin(p.frameCount * 0.2 + i) * 3)
    } else {
      p.fill(ctx.palette.dim); p.textAlign(p.CENTER); p.textSize(11); p.text('PIPELINE ADVANCING', p.width / 2, 535)
    }
  }
}
