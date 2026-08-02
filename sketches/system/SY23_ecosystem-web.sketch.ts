import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Species { x: number; y: number; level: number; phase: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const species: Species[] = []
  const links: Array<[number, number]> = []
  let plants = 68
  let grazers = 34
  let hunters = 15

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    const counts = [5, 4, 3]
    for (let level = 0; level < counts.length; level++) for (let i = 0; i < counts[level]!; i++) {
      species.push({ x: ((i + 1) / (counts[level]! + 1)) * p.width, y: 495 - level * 175, level, phase: p.random(p.TWO_PI) })
    }
    for (let a = 0; a < species.length; a++) for (let b = 0; b < species.length; b++) {
      if (species[b]!.level === species[a]!.level + 1 && (a + b) % 3 !== 0) links.push([a, b])
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    const season = 1 + 0.22 * Math.sin(p.frameCount * 0.013)
    const dp = 0.42 * plants * (1 - plants / (92 * season)) - 0.007 * plants * grazers
    const dg = 0.0034 * plants * grazers - 0.16 * grazers - 0.006 * grazers * hunters
    const dh = 0.0031 * grazers * hunters - 0.095 * hunters
    plants = p.constrain(plants + dp * 0.055, 8, 100)
    grazers = p.constrain(grazers + dg * 0.055, 5, 80)
    hunters = p.constrain(hunters + dh * 0.055, 3, 55)
    const energy = [plants, grazers, hunters]
    for (let i = 0; i < links.length; i++) {
      const [a, b] = links[i]!
      const from = species[a]!
      const to = species[b]!
      const edge = p.color(ctx.palette.signal); edge.setAlpha(35 + energy[from.level]! * 0.55)
      p.stroke(edge); p.strokeWeight(1); p.line(from.x, from.y, to.x, to.y)
      const q = (p.frameCount * (0.009 + from.level * 0.004) + i * 0.113) % 1
      p.noStroke(); p.fill(i % 7 === 0 ? ctx.palette.accent : ctx.palette.signal)
      p.circle(p.lerp(from.x, to.x, q), p.lerp(from.y, to.y, q), 4 + from.level)
    }
    for (let i = 0; i < species.length; i++) {
      const node = species[i]!
      const radius = 9 + Math.sqrt(energy[node.level]!) * 2.2 + Math.sin(p.frameCount * 0.04 + node.phase) * 2
      p.noStroke(); p.fill(node.level === 2 ? ctx.palette.accent : ctx.palette.signal); p.circle(node.x, node.y, radius)
      p.noFill(); p.stroke(ctx.palette.paper); p.circle(node.x, node.y, radius + 9)
    }
    const labels = ['PRODUCERS', 'GRAZERS', 'PREDATORS']
    p.noStroke(); p.fill(ctx.palette.dim); p.textAlign(p.LEFT); p.textSize(10)
    for (let i = 0; i < labels.length; i++) p.text(`${labels[i]}  ${energy[i]!.toFixed(1)}`, 34, 545 - i * 175)
  }
}
