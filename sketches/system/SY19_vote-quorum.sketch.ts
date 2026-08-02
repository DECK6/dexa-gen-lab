import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Ballot { choice: number; delay: number; counted: boolean }

export function sketch(p: P5, ctx: SketchCtx): void {
  const total = 11
  const quorum = 7
  let ballots: Ballot[] = []
  let counts = [0, 0, 0]
  let winner = -1
  let roundStart = 1

  const reset = () => {
    const favored = p.floor(p.random(3))
    ballots = Array.from({ length: total }, () => ({ choice: p.random() < 0.72 ? favored : p.floor(p.random(3)), delay: p.floor(p.random(16, 92)), counted: false }))
    counts = [0, 0, 0]; winner = -1; roundStart = p.frameCount
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    reset()
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const age = p.frameCount - roundStart
    if (age > 145) reset()
    for (const ballot of ballots) if (!ballot.counted && age >= ballot.delay) {
      ballot.counted = true
      counts[ballot.choice]++
      if (counts[ballot.choice]! >= quorum && winner < 0) winner = ballot.choice
    }
    const cx = p.width / 2
    const cy = p.height / 2
    const network = p.color(ctx.palette.signal); network.setAlpha(45)
    p.stroke(network); p.strokeWeight(1)
    for (let i = 0; i < total; i++) {
      const angle = -p.HALF_PI + (i / total) * p.TWO_PI
      p.line(cx + Math.cos(angle) * 235, cy + Math.sin(angle) * 235, cx, cy)
    }
    p.noFill(); p.stroke(winner >= 0 ? ctx.palette.accent : ctx.palette.signal); p.strokeWeight(3)
    p.circle(cx, cy, 116 + Math.sin(p.frameCount * 0.08) * 5)
    for (let i = 0; i < total; i++) {
      const angle = -p.HALF_PI + (i / total) * p.TWO_PI
      const x = cx + Math.cos(angle) * 235
      const y = cy + Math.sin(angle) * 235
      const ballot = ballots[i]!
      p.noStroke(); p.fill(ballot.counted ? ctx.palette.signal : ctx.palette.paper); p.circle(x, y, 19)
      if (!ballot.counted && age > ballot.delay - 24) {
        const q = p.constrain((age - ballot.delay + 24) / 24, 0, 1)
        p.fill(ballot.choice === 2 ? ctx.palette.accent : ctx.palette.signal)
        p.circle(p.lerp(x, cx, q), p.lerp(y, cy, q), 7)
      }
    }
    p.textAlign(p.CENTER); p.textSize(16)
    for (let i = 0; i < 3; i++) {
      p.fill(i === winner ? ctx.palette.accent : ctx.palette.paper)
      p.text(`${String.fromCharCode(65 + i)} ${counts[i]}`, cx - 62 + i * 62, cy + 6)
    }
    p.fill(ctx.palette.dim); p.textSize(10); p.text(`QUORUM ${quorum}/${total}`, cx, cy + 33)
  }
}
