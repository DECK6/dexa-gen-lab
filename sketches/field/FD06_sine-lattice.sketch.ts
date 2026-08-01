import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const N = 40 // cells per side; (N+1)^2 lattice nodes
const WAVES = 3

interface Wave {
  kx: number
  ky: number
  sp: number
  ax: number
  ay: number
}

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const waves: Wave[] = []
  const nodeX = new Float32Array((N + 1) * (N + 1))
  const nodeY = new Float32Array((N + 1) * (N + 1))
  const rowHeat = new Float32Array(N + 1)
  const colHeat = new Float32Array(N + 1)

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.background(pal.bg)
    for (let i = 0; i < WAVES; i++) {
      const dir = p.random(p.TWO_PI)
      const k = p.random(0.012, 0.034)
      waves.push({
        kx: Math.cos(dir) * k,
        ky: Math.sin(dir) * k,
        sp: p.random(0.02, 0.055) * (p.random() < 0.5 ? -1 : 1),
        ax: p.random(-13, 13),
        ay: p.random(-13, 13),
      })
    }
  }

  p.draw = () => {
    const veil = p.color(pal.bg)
    veil.setAlpha(34)
    p.noStroke()
    p.fill(veil)
    p.rect(0, 0, p.width, p.height)

    const gx = p.width / N
    const gy = p.height / N
    const t = p.frameCount
    rowHeat.fill(0)
    colHeat.fill(0)

    for (let j = 0; j <= N; j++) {
      const by = j * gy
      for (let i = 0; i <= N; i++) {
        const bx = i * gx
        let dx = 0
        let dy = 0
        for (let w = 0; w < WAVES; w++) {
          const wv = waves[w]!
          const s = Math.sin(bx * wv.kx + by * wv.ky + t * wv.sp)
          dx += s * wv.ax
          dy += s * wv.ay
        }
        const idx = j * (N + 1) + i
        nodeX[idx] = bx + dx
        nodeY[idx] = by + dy
        const h = (Math.abs(dx) + Math.abs(dy)) * 0.5
        rowHeat[j]! += h
        colHeat[i]! += h
      }
    }

    const cyan = p.color(pal.signal)
    const orange = p.color(pal.accent)
    p.noFill()
    p.strokeWeight(1)

    for (let j = 0; j <= N; j++) {
      const hot = j % 8 === 0
      const col = hot ? orange : cyan
      col.setAlpha(26 + p.constrain(rowHeat[j]! / (N + 1) / 9, 0, 1) * (hot ? 150 : 95))
      p.stroke(col)
      p.beginShape()
      for (let i = 0; i <= N; i++) {
        const idx = j * (N + 1) + i
        p.vertex(nodeX[idx]!, nodeY[idx]!)
      }
      p.endShape()
    }

    for (let i = 0; i <= N; i++) {
      const hot = i % 8 === 0
      const col = hot ? orange : cyan
      col.setAlpha(20 + p.constrain(colHeat[i]! / (N + 1) / 9, 0, 1) * (hot ? 130 : 75))
      p.stroke(col)
      p.beginShape()
      for (let j = 0; j <= N; j++) {
        const idx = j * (N + 1) + i
        p.vertex(nodeX[idx]!, nodeY[idx]!)
      }
      p.endShape()
    }
  }
}
