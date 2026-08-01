#!/usr/bin/env node
/**
 * Registry lint (SPEC §4). Fails the build on:
 *  - meta/sketch pair mismatch (either direction)
 *  - duplicate IDs, ID not matching the filename prefix, slug mismatch
 *  - meta category not matching its folder, unknown engine
 *  - non-deterministic time/randomness in .sketch.ts
 *    (Math.random / Date.now / performance.now / .millis() / noLoop())
 *  - hex color literals in .sketch.ts (palette tokens only)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const SKETCHES = join(ROOT, 'sketches')

const CATEGORIES = [
  'field',
  'particle',
  'geometry',
  'fractal',
  'automata',
  'organic',
  'glyph',
  'space',
  'shader',
  'chaos',
  'wave',
  'optics',
  'data',
  'system',
  'kinetic',
  'textile',
  'fluid',
  'minimal',
  'topology',
  'cosmic',
]
const ENGINES = ['p5', 'three']

const FORBIDDEN = [
  [/Math\.random\s*\(/, 'Math.random() — use ctx.random or p.random'],
  [/Date\.now\s*\(/, 'Date.now() — use p.frameCount or the runner clock'],
  [/performance\.now\s*\(/, 'performance.now() — use p.frameCount or the runner clock'],
  [/\.millis\s*\(/, 'p.millis() — use p.frameCount (thumbnail determinism)'],
  [/noLoop\s*\(/, 'noLoop() — every sketch must animate'],
  [/#[0-9a-fA-F]{3,8}\b/, 'hex color literal — use ctx.palette / shaderQuad uniforms'],
]

const errors = []
const ids = new Map()
let sketchCount = 0

if (!existsSync(SKETCHES)) {
  console.log('lint:registry — sketches/ not present yet, nothing to lint')
  process.exit(0)
}

for (const category of readdirSync(SKETCHES)) {
  const categoryDir = join(SKETCHES, category)
  if (!statSync(categoryDir).isDirectory()) continue
  if (!CATEGORIES.includes(category)) {
    errors.push(`folder: sketches/${category} is not a known category`)
    continue
  }

  for (const file of readdirSync(categoryDir)) {
    const path = join(categoryDir, file)
    const where = `${category}/${file}`

    if (file.endsWith('.meta.ts')) {
      const match = file.match(/^([A-Z]{2}\d{2})_([a-z0-9-]+)\.meta\.ts$/)
      if (!match) {
        errors.push(`naming: ${where} does not match <ID>_<slug>.meta.ts`)
        continue
      }
      const [, id, slug] = match
      if (ids.has(id)) errors.push(`duplicate id ${id}: ${where} vs ${ids.get(id)}`)
      ids.set(id, where)

      if (!existsSync(path.replace(/\.meta\.ts$/, '.sketch.ts'))) {
        errors.push(`pair: ${where} has no matching ${id}_${slug}.sketch.ts`)
      }

      const source = readFileSync(path, 'utf8')
      const field = (name) => source.match(new RegExp(`${name}:\\s*'([^']*)'`))?.[1]
      if (field('id') !== id) errors.push(`meta id: ${where} must declare id '${id}'`)
      if (field('slug') !== slug) errors.push(`meta slug: ${where} must declare slug '${slug}'`)
      if (field('category') !== category) {
        errors.push(`meta category: ${where} must declare category '${category}'`)
      }
      const engine = field('engine')
      if (!ENGINES.includes(engine)) {
        errors.push(`meta engine: ${where} has engine '${engine}' (expected p5 | three)`)
      }
      continue
    }

    if (file.endsWith('.sketch.ts')) {
      sketchCount++
      const match = file.match(/^([A-Z]{2}\d{2})_([a-z0-9-]+)\.sketch\.ts$/)
      if (!match) {
        errors.push(`naming: ${where} does not match <ID>_<slug>.sketch.ts`)
        continue
      }
      if (!existsSync(path.replace(/\.sketch\.ts$/, '.meta.ts'))) {
        errors.push(`pair: ${where} has no matching ${match[1]}_${match[2]}.meta.ts`)
      }
      const source = readFileSync(path, 'utf8')
      for (const [pattern, message] of FORBIDDEN) {
        const hit = source.match(pattern)
        if (hit) errors.push(`${where}: ${message} (found "${hit[0]}")`)
      }
      continue
    }

    errors.push(`stray file: ${where} — only .meta.ts / .sketch.ts belong in sketches/`)
  }
}

if (errors.length) {
  console.error(`lint:registry — ${errors.length} error(s):`)
  for (const error of errors) console.error(`  ✗ ${error}`)
  process.exit(1)
}
console.log(`lint:registry — OK (${ids.size} meta / ${sketchCount} sketch)`)
