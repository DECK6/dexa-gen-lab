import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Block { alive: boolean; marked: boolean; pos: number; target: number; refs: number[] }
type Phase = 'MARK' | 'SWEEP' | 'COMPACT' | 'HOLD'

export function sketch(p: P5, ctx: SketchCtx): void {
  const blocks: Block[] = []
  let queue: number[] = []
  let phase: Phase = 'MARK'
  let cursor = 0
  let phaseFrame = 0

  const reset = () => {
    blocks.length = 0
    for (let i = 0; i < 48; i++) {
      const group = Math.floor(i / 8) * 8
      const refs = [group + ((i + 1) % 8), group + ((i + 3) % 8)].filter((j) => j !== i)
      blocks.push({ alive: true, marked: false, pos: i, target: i, refs })
    }
    queue = [0, 16, 32]; phase = 'MARK'; cursor = 0; phaseFrame = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    reset()
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    phaseFrame++
    if (p.frameCount % 3 === 0 && phase === 'MARK') {
      const index = queue.shift()
      if (index === undefined) { phase = 'SWEEP'; cursor = 0; phaseFrame = 0 }
      else if (!blocks[index]!.marked) { blocks[index]!.marked = true; queue.push(...blocks[index]!.refs) }
    } else if (p.frameCount % 2 === 0 && phase === 'SWEEP') {
      if (cursor >= blocks.length) {
        let target = 0
        for (const block of blocks) if (block.alive) block.target = target++
        phase = 'COMPACT'; phaseFrame = 0
      } else { if (!blocks[cursor]!.marked) blocks[cursor]!.alive = false; cursor++ }
    } else if (phase === 'COMPACT') {
      for (const block of blocks) if (block.alive) block.pos = p.lerp(block.pos, block.target, 0.09)
      if (phaseFrame > 75) { phase = 'HOLD'; phaseFrame = 0 }
    } else if (phase === 'HOLD' && phaseFrame > 55) reset()

    const pad = 56
    const sx = 67
    const sy = 70
    p.noFill(); p.stroke(ctx.palette.dim); p.strokeWeight(1)
    for (let i = 0; i < 48; i++) p.rect(pad + (i % 8) * sx, 96 + Math.floor(i / 8) * sy, 51, 45, 3)
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]!
      if (!block.alive) continue
      const col = block.pos % 8
      const row = Math.floor(block.pos / 8)
      const x = pad + col * sx
      const y = 96 + row * sy
      p.noStroke(); p.fill(block.marked ? ctx.palette.signal : ctx.palette.paper); p.rect(x, y, 51, 45, 3)
      p.fill(ctx.palette.ink); p.textAlign(p.CENTER); p.textSize(9); p.text(i, x + 25, y + 27)
    }
    const active = phase === 'SWEEP' ? cursor : queue[0] ?? -1
    if (active >= 0) {
      const block = blocks[active]!
      p.noFill(); p.stroke(ctx.palette.accent); p.strokeWeight(3)
      p.rect(pad + (block.pos % 8) * sx - 3, 93 + Math.floor(block.pos / 8) * sy, 57, 51, 4)
    }
    p.noStroke(); p.fill(ctx.palette.accent); p.textAlign(p.LEFT); p.textSize(13); p.text(phase, pad, 65)
  }
}
