import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

const COLS = 40
const ROWS = 12
const CHARSET = 'DEXAGENLAB0123456789/-+*'

export function sketch(p: P5, ctx: SketchCtx): void {
  const pal = ctx.palette
  const punch: boolean[][] = []
  const chars: string[] = []
  let mx = 0
  let my = 0
  let cw = 0
  let chh = 0
  let last = -1

  const punchColumn = (col: number, gen: number) => {
    const c = punch[col]!
    let bits = 0
    for (let row = 0; row < ROWS; row++) {
      const v = p.noise(col * 0.29, row * 0.47, gen * 0.73 + col * 0.02)
      const on = v > 0.57
      c[row] = on
      if (on) bits += row + 1
    }
    chars[col] = CHARSET.charAt(bits % CHARSET.length)
  }

  p.setup = () => {
    p.createCanvas(ctx.width, ctx.height)
    mx = p.width * 0.07
    my = p.height * 0.2
    cw = (p.width - mx * 2) / COLS
    chh = (p.height - my * 2) / ROWS
    p.textFont('JetBrains Mono, monospace')
    p.textAlign(p.CENTER, p.CENTER)
    p.noStroke()
    for (let col = 0; col < COLS; col++) {
      punch.push(new Array<boolean>(ROWS).fill(false))
      chars.push(' ')
      punchColumn(col, 0)
    }
  }

  p.draw = () => {
    p.background(pal.bg)

    const headF = p.frameCount * 0.3
    const head = Math.floor(headF) % COLS
    const gen = Math.floor(headF / COLS) + 1
    if (head !== last) {
      punchColumn(head, gen)
      last = head
    }

    // card body with the clipped corner
    const body = p.color(pal.ink)
    body.setAlpha(255)
    p.fill(body)
    p.beginShape()
    p.vertex(mx - cw + chh * 0.6, my - chh * 0.8)
    p.vertex(p.width - mx + cw, my - chh * 0.8)
    p.vertex(p.width - mx + cw, p.height - my + chh * 0.4)
    p.vertex(mx - cw, p.height - my + chh * 0.4)
    p.vertex(mx - cw, my - chh * 0.2)
    p.endShape(p.CLOSE)

    // read head
    const beam = p.color(pal.accent)
    beam.setAlpha(40)
    p.fill(beam)
    p.rect(mx + head * cw - cw * 0.2, my - chh * 0.8, cw * 1.4, p.height - my * 2 + chh * 1.2)

    const hole = p.color(pal.signal)
    const blank = p.color(pal.dim)
    for (let col = 0; col < COLS; col++) {
      const dist = ((head - col + COLS) % COLS) / COLS
      const fresh = Math.pow(1 - dist, 8)
      const x = mx + (col + 0.5) * cw
      for (let row = 0; row < ROWS; row++) {
        const y = my + (row + 0.5) * chh
        if (punch[col]![row]) {
          const c = col === head ? beam : hole
          c.setAlpha(150 + 105 * fresh)
          p.fill(c)
          p.rect(x - cw * 0.26, y - chh * 0.3, cw * 0.52, chh * 0.6, cw * 0.12)
        } else {
          blank.setAlpha(30 + 50 * fresh)
          p.fill(blank)
          p.circle(x, y, cw * 0.16)
        }
      }
    }

    // punched characters along the header
    p.textSize(cw * 0.9)
    for (let col = 0; col < COLS; col++) {
      const dist = ((head - col + COLS) % COLS) / COLS
      const c = p.color(col === head ? pal.accent : pal.signal)
      c.setAlpha(90 + 150 * Math.pow(1 - dist, 6))
      p.fill(c)
      p.text(chars[col]!, mx + (col + 0.5) * cw, my - chh * 1.6)
    }

    // row rails
    const rail = p.color(pal.dim)
    rail.setAlpha(55)
    p.fill(rail)
    p.rect(mx - cw, my - chh * 1.0, p.width - mx * 2 + cw * 2, 1)
    p.rect(mx - cw, p.height - my + chh * 0.1, p.width - mx * 2 + cw * 2, 1)
  }
}
