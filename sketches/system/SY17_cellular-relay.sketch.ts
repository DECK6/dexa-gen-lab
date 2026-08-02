import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

interface Tower { x: number; y: number }
interface Mobile { x: number; y: number; vx: number; vy: number; cell: number; flash: number }

export function sketch(p: P5, ctx: SketchCtx): void {
  const towers: Tower[] = []
  const mobiles: Mobile[] = []

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    const sites = [[110, 120], [320, 90], [525, 145], [180, 325], [430, 310], [105, 525], [335, 515], [550, 485]]
    for (const [x, y] of sites) towers.push({ x: (x! / 640) * p.width, y: (y! / 640) * p.height })
    for (let i = 0; i < 30; i++) {
      const angle = p.random(p.TWO_PI)
      mobiles.push({ x: p.random(p.width), y: p.random(p.height), vx: Math.cos(angle) * p.random(0.7, 1.7), vy: Math.sin(angle) * p.random(0.7, 1.7), cell: 0, flash: 0 })
    }
  }

  p.draw = () => {
    p.background(ctx.palette.ink)
    for (const mobile of mobiles) {
      mobile.vx += (p.noise(mobile.x * 0.004, p.frameCount * 0.006) - 0.5) * 0.08
      mobile.vy += (p.noise(mobile.y * 0.004, 40 + p.frameCount * 0.006) - 0.5) * 0.08
      const speed = Math.hypot(mobile.vx, mobile.vy) || 1
      mobile.vx = (mobile.vx / speed) * 1.45; mobile.vy = (mobile.vy / speed) * 1.45
      mobile.x += mobile.vx; mobile.y += mobile.vy
      if (mobile.x < 18 || mobile.x > p.width - 18) mobile.vx *= -1
      if (mobile.y < 18 || mobile.y > p.height - 18) mobile.vy *= -1
      mobile.x = p.constrain(mobile.x, 18, p.width - 18); mobile.y = p.constrain(mobile.y, 18, p.height - 18)
      let best = mobile.cell
      let bestDistance = p.dist(mobile.x, mobile.y, towers[best]!.x, towers[best]!.y) * 0.82
      for (let i = 0; i < towers.length; i++) {
        const distance = p.dist(mobile.x, mobile.y, towers[i]!.x, towers[i]!.y)
        if (distance < bestDistance) { bestDistance = distance; best = i }
      }
      if (best !== mobile.cell) { mobile.cell = best; mobile.flash = 28 }
      if (mobile.flash > 0) mobile.flash--
    }

    const cell = p.color(ctx.palette.signal); cell.setAlpha(28)
    p.noFill(); p.stroke(cell); p.strokeWeight(1)
    for (const tower of towers) { p.circle(tower.x, tower.y, 205); p.circle(tower.x, tower.y, 105) }
    for (const mobile of mobiles) {
      const tower = towers[mobile.cell]!
      const link = p.color(mobile.flash > 0 ? ctx.palette.accent : ctx.palette.signal); link.setAlpha(mobile.flash > 0 ? 210 : 55)
      p.stroke(link); p.line(mobile.x, mobile.y, tower.x, tower.y)
    }
    p.noStroke()
    for (let i = 0; i < towers.length; i++) {
      const tower = towers[i]!
      p.fill(ctx.palette.paper); p.rect(tower.x - 3, tower.y - 12, 6, 24)
      p.fill(ctx.palette.signal); p.circle(tower.x, tower.y - 13, 11)
    }
    for (const mobile of mobiles) {
      p.fill(mobile.flash > 0 ? ctx.palette.accent : ctx.palette.signal)
      p.circle(mobile.x, mobile.y, mobile.flash > 0 ? 10 : 5)
    }
  }
}
