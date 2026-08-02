import { describe, expect, test } from 'bun:test'
import { jaccard, parseCatalog, sketchShingles } from './audit-catalog.mjs'

describe('catalog neighbor audit primitives', () => {
  test('normalizes literal-only sketch variants to the same signature', () => {
    const first = `
      export function sketch(p, ctx) {
        const count = 120
        p.draw = () => p.circle(10, 20, count)
      }
    `
    const second = `
      export function sketch(p, ctx) {
        const count = 900
        p.draw = () => p.circle(45, 75, count)
      }
    `

    expect(jaccard(sketchShingles(first), sketchShingles(second))).toBe(1)
  })

  test('keeps an algorithm change below the clone threshold', () => {
    const orbit = `
      export function sketch(p, ctx) {
        p.draw = () => { velocity += gravity / radius ** 2; p.line(x, y, x + velocity, y) }
      }
    `
    const automaton = `
      export function sketch(p, ctx) {
        p.draw = () => { next[cell] = neighbors === 3 ? 1 : 0; p.square(x, y, cellSize) }
      }
    `

    expect(jaccard(sketchShingles(orbit), sketchShingles(automaton))).toBeLessThan(0.8)
  })

  test('parses golden IDs and W6 neighbor declarations', () => {
    const rows = parseCatalog(`
| ID | slug | title | 설명 |
|---|---|---|---|
| FD01 ★ | perlin-flow | PERLIN FLOW | 기준작 |

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| FD11 | ridge-split | RIDGE SPLIT | 신규작 | FD01과 다른 능선 분기 규칙 |
`)

    expect(rows).toEqual([
      { id: 'FD01', slug: 'perlin-flow', title: 'PERLIN FLOW', description: '기준작', neighbor: '' },
      {
        id: 'FD11',
        slug: 'ridge-split',
        title: 'RIDGE SPLIT',
        description: '신규작',
        neighbor: 'FD01과 다른 능선 분기 규칙',
      },
    ])
  })
})
