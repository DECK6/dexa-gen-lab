import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Packet { x: number; y: number; tx: number; ty: number; wait: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const cols = 17
  const rows = 17
  const packets: Packet[] = []
  const occupancy = new Array<number>(cols * rows).fill(0)
  const open = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows && (x % 2 === 1 || y % 2 === 1)

  const resetPacket = (packet: Packet, reverse: boolean) => {
    packet.x = reverse ? cols - 1 : 0
    packet.tx = reverse ? 0 : cols - 1
    packet.y = p.floor(p.random(rows / 2)) * 2 + 1
    packet.ty = p.floor(p.random(rows / 2)) * 2 + 1
    packet.wait = 0
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    for (let i = 0; i < 46; i++) {
      const packet = { x: 0, y: 1, tx: cols - 1, ty: 1, wait: p.floor(p.random(4)) }
      const reverse = i % 2 === 1
      resetPacket(packet, reverse)
      packet.x += (i % 7) * (reverse ? -1 : 1)
      packets.push(packet)
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    occupancy.fill(0)
    for (const packet of packets) occupancy[packet.y * cols + packet.x]++
    if (p.frameCount % 4 === 0) {
      for (let i = 0; i < packets.length; i++) {
        const packet = packets[i]!
        if (packet.wait > 0) { packet.wait--; continue }
        if (packet.x === packet.tx && packet.y === packet.ty) { resetPacket(packet, packet.tx > 0); continue }
        let bx = packet.x
        let by = packet.y
        let best = Infinity
        const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]]
        for (let d = 0; d < dirs.length; d++) {
          const nx = packet.x + dirs[d]![0]!
          const ny = packet.y + dirs[d]![1]!
          if (!open(nx, ny)) continue
          const congestion = occupancy[ny * cols + nx]!
          const cost = Math.abs(packet.tx - nx) + Math.abs(packet.ty - ny) + congestion * 3 + p.random(0.4)
          if (cost < best) { best = cost; bx = nx; by = ny }
        }
        occupancy[packet.y * cols + packet.x]--
        packet.x = bx; packet.y = by
        occupancy[by * cols + bx]++
        packet.wait = Math.max(0, occupancy[by * cols + bx]! - 2)
      }
    }

    const pad = 42
    const sx = (p.width - pad * 2) / (cols - 1)
    const sy = (p.height - pad * 2) / (rows - 1)
    const lane = p.color(ctx.palette.signal); lane.setAlpha(65)
    p.stroke(lane); p.strokeWeight(1)
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      if (!open(x, y)) continue
      if (open(x + 1, y)) p.line(pad + x * sx, pad + y * sy, pad + (x + 1) * sx, pad + y * sy)
      if (open(x, y + 1)) p.line(pad + x * sx, pad + y * sy, pad + x * sx, pad + (y + 1) * sy)
    }
    p.noStroke()
    for (let i = 0; i < packets.length; i++) {
      const packet = packets[i]!
      p.fill(packet.wait > 1 ? ctx.palette.accent : ctx.palette.signal)
      p.circle(pad + packet.x * sx, pad + packet.y * sy, i % 9 === 0 ? 8 : 5)
    }
  }
}
