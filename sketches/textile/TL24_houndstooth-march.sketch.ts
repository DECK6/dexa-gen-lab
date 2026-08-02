import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const SIZE = 64

export function sketch(p: P5, ctx: SketchCtx): void {
  const drawHound = (x: number, y: number, size: number, hot: boolean) => {
    const color = p.color(hot ? ctx.palette.accent : ctx.palette.signal)
    color.setAlpha(hot ? 225 : 150)
    p.noStroke()
    p.fill(color)
    p.beginShape()
    p.vertex(x, y)
    p.vertex(x + size * 0.5, y)
    p.vertex(x + size * 0.62, y + size * 0.25)
    p.vertex(x + size, y + size * 0.25)
    p.vertex(x + size * 0.75, y + size * 0.5)
    p.vertex(x + size * 0.75, y + size)
    p.vertex(x + size * 0.5, y + size * 0.75)
    p.vertex(x + size * 0.25, y + size * 0.75)
    p.vertex(x + size * 0.25, y + size * 0.5)
    p.vertex(x, y + size * 0.38)
    p.vertex(x + size * 0.25, y + size * 0.25)
    p.endShape(p.CLOSE)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
  }

  p.draw = () => {
    p.background(ctx.palette.bg)
    const rows = Math.ceil(p.height / SIZE) + 2
    const cols = Math.ceil(p.width / SIZE) + 4
    const march = p.frameCount * 0.32
    for (let row = -1; row < rows; row++) {
      const direction = row % 2 === 0 ? 1 : -1
      const offset = ((march * direction + row * SIZE * 0.37) % (SIZE * 2)) - SIZE * 2
      for (let col = -2; col < cols; col++) {
        const x = col * SIZE + offset
        const y = row * SIZE
        const wave = Math.sin(p.frameCount * 0.035 - row * 0.7 - col * 0.45)
        p.push()
        p.translate(x + SIZE / 2, y + SIZE / 2)
        if ((row + col) % 2 !== 0) p.rotate(p.PI)
        const scale = 0.88 + Math.max(0, wave) * 0.12
        p.scale(scale)
        drawHound(-SIZE / 2, -SIZE / 2, SIZE, wave > 0.92)
        p.pop()
      }
    }

    const scan = p.color(ctx.palette.paper)
    scan.setAlpha(85)
    p.stroke(scan)
    p.strokeWeight(1)
    const scanY = (p.frameCount * 1.1) % p.height
    p.line(0, scanY, p.width, scanY)
  }
}
