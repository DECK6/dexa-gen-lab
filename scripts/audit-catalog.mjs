#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const W6_MIN = 11
const LEXICAL_CLONE_THRESHOLD = 0.72
const STRUCTURAL_CLONE_THRESHOLD = 0.78
const SHINGLE_SIZE = 7

const STRUCTURAL_KEYWORDS = new Set(
  [
    'as', 'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue',
    'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'float',
    'for', 'from', 'function', 'if', 'import', 'in', 'instanceof', 'interface', 'let',
    'mat2', 'mat3', 'mat4', 'new', 'null', 'of', 'return', 'satisfies', 'static',
    'struct', 'switch', 'this', 'throw', 'true', 'try', 'type', 'typeof', 'undefined',
    'uniform', 'var', 'varying', 'vec2', 'vec3', 'vec4', 'void', 'while', 'yield',
  ],
)

export function parseCatalog(markdown) {
  const rows = []
  for (const line of markdown.split('\n')) {
    if (!line.startsWith('|')) continue
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    const id = cells[0]?.match(/^([A-Z]{2}\d{2})(?:\s+★)?$/)?.[1]
    if (!id) continue
    rows.push({
      id,
      slug: cells[1] ?? '',
      title: cells[2] ?? '',
      description: cells[3] ?? '',
      neighbor: cells[4] ?? '',
    })
  }
  return rows
}

function tokenizeSketch(source, structural) {
  const clean = source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/.*$/gm, ' ')
    .replace(/^import .*$/gm, ' ')
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, ' STR ')
    // Keep template contents (notably GLSL), but discard the quote delimiters.
    .replaceAll('`', ' ')
  const raw = clean.match(
    /[A-Za-z_$][\w$]*|\d+(?:\.\d+)?(?:e[+-]?\d+)?|===|!==|==|!=|<=|>=|=>|\+\+|--|&&|\|\||\*\*|[{}()[\].,;:+\-*/%<>=!?&|^~]/gi,
  ) ?? []
  return raw.map((token, index) => {
    if (/^\d/.test(token)) return 'NUM'
    if (
      !structural ||
      !/^[A-Za-z_$]/.test(token) ||
      STRUCTURAL_KEYWORDS.has(token) ||
      raw[index - 1] === '.'
    ) {
      return token
    }
    return 'ID'
  })
}

export function sketchShingles(source, structural = false, size = SHINGLE_SIZE) {
  const tokens = tokenizeSketch(source, structural)
  const shingles = new Set()
  for (let index = 0; index <= tokens.length - size; index++) {
    shingles.add(tokens.slice(index, index + size).join(' '))
  }
  return shingles
}

export function jaccard(first, second) {
  const [small, large] = first.size <= second.size ? [first, second] : [second, first]
  let intersection = 0
  for (const value of small) if (large.has(value)) intersection++
  return intersection / (first.size + second.size - intersection || 1)
}

function metaValue(source, field) {
  return source.match(new RegExp(`${field}:\\s*'([^']*)'`))?.[1]
}

function readSketchRecords(root) {
  const sketchesRoot = join(root, 'sketches')
  const records = []
  for (const category of readdirSync(sketchesRoot).sort()) {
    const categoryDir = join(sketchesRoot, category)
    if (!statSync(categoryDir).isDirectory()) continue
    for (const file of readdirSync(categoryDir).sort()) {
      const match = file.match(/^([A-Z]{2}\d{2})_([a-z0-9-]+)\.sketch\.ts$/)
      if (!match) continue
      const source = readFileSync(join(categoryDir, file), 'utf8')
      records.push({
        id: match[1],
        slug: match[2],
        category,
        path: join('sketches', category, file),
        source,
        lines: source.trimEnd().split('\n').length,
        lexical: sketchShingles(source),
        structural: sketchShingles(source, true),
      })
    }
  }
  return records
}

export function auditCatalog(root = ROOT) {
  const errors = []
  const catalogRows = parseCatalog(readFileSync(join(root, 'docs/CATALOG.md'), 'utf8'))
  const catalogById = new Map()
  for (const row of catalogRows) {
    if (catalogById.has(row.id)) errors.push(`duplicate catalog id ${row.id}`)
    catalogById.set(row.id, row)
  }
  if (catalogRows.length !== 500) errors.push(`catalog has ${catalogRows.length} rows (expected 500)`)

  const sketches = readSketchRecords(root)
  const sketchById = new Map(sketches.map((record) => [record.id, record]))
  if (sketches.length !== 500) errors.push(`repository has ${sketches.length} sketches (expected 500)`)

  let metaCount = 0
  let p5Count = 0
  let threeCount = 0
  const sketchesRoot = join(root, 'sketches')
  for (const category of readdirSync(sketchesRoot).sort()) {
    const categoryDir = join(sketchesRoot, category)
    if (!statSync(categoryDir).isDirectory()) continue
    for (const file of readdirSync(categoryDir).sort()) {
      if (!file.endsWith('.meta.ts')) continue
      metaCount++
      const source = readFileSync(join(categoryDir, file), 'utf8')
      const id = metaValue(source, 'id')
      const row = catalogById.get(id)
      if (!row) {
        errors.push(`${category}/${file}: id ${id ?? '(missing)'} is absent from CATALOG.md`)
        continue
      }
      for (const field of ['slug', 'title', 'description']) {
        const actual = metaValue(source, field)
        if (actual !== row[field]) errors.push(`${id}: meta ${field} does not match CATALOG.md`)
      }
      if (metaValue(source, 'category') !== category) errors.push(`${id}: meta category mismatch`)
      const engine = metaValue(source, 'engine')
      if (engine === 'p5') p5Count++
      else if (engine === 'three') threeCount++
    }
  }
  if (metaCount !== 500) errors.push(`repository has ${metaCount} meta files (expected 500)`)
  if (p5Count !== 400 || threeCount !== 100) {
    errors.push(`engine split is p5 ${p5Count} / three ${threeCount} (expected 400 / 100)`)
  }

  const w6Rows = catalogRows.filter((row) => Number(row.id.slice(2)) >= W6_MIN)
  if (w6Rows.length !== 300) errors.push(`catalog has ${w6Rows.length} W6 rows (expected 300)`)
  for (const row of w6Rows) {
    const references = row.neighbor.match(/\b[A-Z]{2}\d{2}\b/g) ?? []
    if (!row.neighbor || references.length === 0) {
      errors.push(`${row.id}: missing nearest-neighbor distinction`)
      continue
    }
    for (const reference of references) {
      if (reference === row.id) errors.push(`${row.id}: neighbor declaration references itself`)
      if (!catalogById.has(reference) || !sketchById.has(reference)) {
        errors.push(`${row.id}: neighbor ${reference} does not exist in catalog and repository`)
      }
    }
  }

  for (const record of sketches) {
    if (Number(record.id.slice(2)) >= W6_MIN && record.lines > 150) {
      errors.push(`${record.id}: ${record.lines} lines exceeds the W6 150-line limit`)
    }
  }

  const comparisons = []
  let comparisonCount = 0
  for (let first = 0; first < sketches.length; first++) {
    for (let second = first + 1; second < sketches.length; second++) {
      const a = sketches[first]
      const b = sketches[second]
      if (Number(a.id.slice(2)) < W6_MIN && Number(b.id.slice(2)) < W6_MIN) continue
      comparisonCount++
      const lexical = jaccard(a.lexical, b.lexical)
      const structural = jaccard(a.structural, b.structural)
      comparisons.push({ a, b, lexical, structural })
      if (lexical >= LEXICAL_CLONE_THRESHOLD || structural >= STRUCTURAL_CLONE_THRESHOLD) {
        errors.push(
          `${a.id}/${b.id}: near-clone similarity lexical=${lexical.toFixed(3)} structural=${structural.toFixed(3)}`,
        )
      }
    }
  }
  comparisons.sort(
    (left, right) => Math.max(right.lexical, right.structural) - Math.max(left.lexical, left.structural),
  )

  return {
    errors,
    stats: {
      catalog: catalogRows.length,
      meta: metaCount,
      sketches: sketches.length,
      w6: w6Rows.length,
      p5: p5Count,
      three: threeCount,
      comparisonCount,
    },
    closest: comparisons.slice(0, 8).map(({ a, b, lexical, structural }) => ({
      first: a.id,
      second: b.id,
      lexical,
      structural,
    })),
  }
}

function main() {
  const result = auditCatalog()
  if (result.errors.length > 0) {
    console.error(`audit:catalog — ${result.errors.length} error(s):`)
    for (const error of result.errors) console.error(`  ✗ ${error}`)
    process.exitCode = 1
    return
  }
  const { stats } = result
  console.log(
    `audit:catalog — OK (${stats.catalog} catalog / ${stats.meta} meta / ${stats.sketches} sketch; ` +
      `W6 ${stats.w6} neighbor declarations; p5 ${stats.p5} / three ${stats.three}; ` +
      `${stats.comparisonCount.toLocaleString('en-US')} W6-in-scope pair comparisons)`,
  )
  console.log('closest normalized source pairs (all below clone thresholds):')
  for (const pair of result.closest) {
    console.log(
      `  ${pair.first}/${pair.second} lexical=${pair.lexical.toFixed(3)} structural=${pair.structural.toFixed(3)}`,
    )
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
