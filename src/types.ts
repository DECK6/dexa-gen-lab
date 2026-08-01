import type P5 from 'p5'
import type * as THREE from 'three'

export type Engine = 'p5' | 'three'

export type CategoryId =
  | 'field'
  | 'particle'
  | 'geometry'
  | 'fractal'
  | 'automata'
  | 'organic'
  | 'glyph'
  | 'space'
  | 'shader'
  | 'chaos'
  | 'wave'
  | 'optics'
  | 'data'
  | 'system'
  | 'kinetic'
  | 'textile'
  | 'fluid'
  | 'minimal'
  | 'topology'
  | 'cosmic'

export interface SketchMeta {
  id: string
  slug: string
  title: string
  category: CategoryId
  engine: Engine
  tags: string[]
  description: string
}

export interface Palette {
  bg: string
  ink: string
  signal: string
  accent: string
  paper: string
  dim: string
}

export interface SketchCtx {
  width: number
  height: number
  seed: number
  random: () => number
  palette: Palette
}

export type P5SketchFn = (p: P5, ctx: SketchCtx) => void

export interface ThreeSketch {
  scene: THREE.Scene
  camera: THREE.Camera
  update?: (t: number, dt: number) => void
  dispose?: () => void
}

export type ThreeSketchFn = (ctx: SketchCtx) => ThreeSketch
