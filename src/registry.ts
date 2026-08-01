import type { CategoryId, Engine, P5SketchFn, SketchMeta, ThreeSketchFn } from './types'

export interface Category {
  id: CategoryId
  label: string
}

// Display order of the filter chips (SPEC §5). Sketch order is by id.
export const CATEGORIES: Category[] = [
  { id: 'field', label: 'FIELD' },
  { id: 'particle', label: 'PARTICLE' },
  { id: 'geometry', label: 'GEOMETRY' },
  { id: 'fractal', label: 'FRACTAL' },
  { id: 'automata', label: 'AUTOMATA' },
  { id: 'organic', label: 'ORGANIC' },
  { id: 'glyph', label: 'GLYPH' },
  { id: 'space', label: 'SPACE' },
  { id: 'shader', label: 'SHADER' },
  { id: 'chaos', label: 'CHAOS' },
]

export const ENGINES: Engine[] = ['p5', 'three']

export interface SketchModule {
  sketch: P5SketchFn | ThreeSketchFn
}

export interface SketchEntry {
  meta: SketchMeta
  /** lazy chunk — loaded on card activation / detail entry (SPEC §4) */
  load: () => Promise<SketchModule>
  /** lazy raw source for the code panel */
  source: () => Promise<string>
}

const metaModules = import.meta.glob<SketchMeta>('../sketches/**/*.meta.ts', {
  eager: true,
  import: 'default',
})
const sketchModules = import.meta.glob<SketchModule>('../sketches/**/*.sketch.ts')
const sourceModules = import.meta.glob<string>('../sketches/**/*.sketch.ts', {
  query: '?raw',
  import: 'default',
})

function build(): SketchEntry[] {
  const entries: SketchEntry[] = []
  for (const [path, meta] of Object.entries(metaModules)) {
    const sketchPath = path.replace(/\.meta\.ts$/, '.sketch.ts')
    const load = sketchModules[sketchPath]
    const source = sourceModules[sketchPath]
    if (!load || !source) {
      console.warn(`registry: ${meta.id} has no matching .sketch.ts — skipped`)
      continue
    }
    entries.push({ meta, load, source })
  }
  return entries.sort((a, b) => a.meta.id.localeCompare(b.meta.id))
}

export const SKETCHES: SketchEntry[] = build()

const index = new Map(SKETCHES.map((entry) => [entry.meta.id, entry]))

export function byId(id: string): SketchEntry | undefined {
  return index.get(id)
}

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id.toUpperCase()
}
