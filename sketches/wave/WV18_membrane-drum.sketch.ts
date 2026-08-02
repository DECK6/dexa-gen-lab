import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const MODES = [[0, 1], [2, 1], [3, 2]] as const

function modeHeight(radius: number, angle: number, azimuth: number, radial: number): number {
  const centerShape = azimuth === 0 ? 1 : radius ** azimuth
  return centerShape * Math.cos((radial - 0.5) * Math.PI * radius) * Math.cos(azimuth * angle)
}

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    p.pixelDensity(1)
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const epoch = Math.floor(p.frameCount / 240)
    const local = p.frameCount % 240
    const blend = Math.max(0, (local - 180) / 60)
    const eased = blend * blend * (3 - 2 * blend)
    const modeA = MODES[epoch % MODES.length]
    const modeB = MODES[(epoch + 1) % MODES.length]
    const time = p.frameCount * 0.035
    const cx = ctx.width * 0.5
    const cy = ctx.height * 0.52
    const radius = Math.min(ctx.width, ctx.height) * 0.39
    const heightAt = (r: number, angle: number): number => {
      const a = modeHeight(r, angle, modeA[0], modeA[1])
      const b = modeHeight(r, angle, modeB[0], modeB[1])
      return p.lerp(a, b, eased) * Math.cos(time) * radius * 0.17
    }

    p.noFill()
    for (let ring = 1; ring <= 13; ring++) {
      const r = ring / 13
      p.stroke(ring % 5 === 0 ? ctx.palette.accent : ctx.palette.signal)
      p.strokeWeight(ring % 5 === 0 ? 1.8 : 1)
      p.beginShape()
      for (let step = 0; step <= 96; step++) {
        const angle = step / 96 * p.TWO_PI
        p.vertex(cx + Math.cos(angle) * radius * r, cy + Math.sin(angle) * radius * r * 0.58 - heightAt(r, angle))
      }
      p.endShape()
    }
    p.stroke(ctx.palette.dim)
    for (let spoke = 0; spoke < 16; spoke++) {
      const angle = spoke / 16 * p.TWO_PI
      p.beginShape()
      for (let step = 0; step <= 20; step++) {
        const r = step / 20
        p.vertex(cx + Math.cos(angle) * radius * r, cy + Math.sin(angle) * radius * r * 0.58 - heightAt(r, angle))
      }
      p.endShape()
    }
    p.stroke(ctx.palette.paper)
    p.strokeWeight(3)
    p.ellipse(cx, cy, radius * 2, radius * 1.16)
    p.fill(ctx.palette.accent)
    p.noStroke()
    p.circle(cx, cy - heightAt(0, 0), 7)
  }
}
