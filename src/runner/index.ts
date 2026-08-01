import type { SketchEntry } from '../registry'
import type { P5SketchFn, ThreeSketchFn } from '../types'

declare global {
  interface Window {
    /** set by a runner once the sketch has produced its first (or thumb-final) frame */
    __SKETCH_READY__?: boolean
  }
}

export interface MountOptions {
  seed: number
  /** logical canvas edge in px — always 1:1 (SPEC §2-4). CSS scales it to the slot. */
  size: number
  /** deterministic still: step a fixed number of frames, then stop */
  thumb?: boolean
}

export interface SketchHandle {
  destroy: () => void
}

/** frames stepped before a thumb-mode sketch freezes (SPEC §5) */
export const THUMB_FRAMES = 90

export async function mountSketch(
  container: HTMLElement,
  entry: SketchEntry,
  options: MountOptions,
): Promise<SketchHandle> {
  const module = await entry.load()
  if (entry.meta.engine === 'p5') {
    const { mount } = await import('./p5')
    return mount(container, module.sketch as P5SketchFn, options)
  }
  const { mount } = await import('./three')
  return mount(container, module.sketch as ThreeSketchFn, options)
}
