import * as THREE from 'three'
import { DEXA_PALETTE } from '../palette'
import { mulberry32 } from '../prng'
import type { SketchCtx, ThreeSketchFn } from '../types'
import { THUMB_FRAMES, type MountOptions, type SketchHandle } from './index'

const THUMB_DT = 1 / 60

export function mount(
  container: HTMLElement,
  fn: ThreeSketchFn,
  options: MountOptions,
): SketchHandle {
  const ctx: SketchCtx = {
    width: options.size,
    height: options.size,
    seed: options.seed,
    random: mulberry32(options.seed),
    palette: DEXA_PALETTE,
  }

  window.__SKETCH_READY__ = false

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(options.size, options.size)
  renderer.setClearColor(new THREE.Color(DEXA_PALETTE.bg), 1)
  container.appendChild(renderer.domElement)

  const sketch = fn(ctx)
  let raf = 0

  if (options.thumb) {
    // Fixed-step clock so the still is identical on every run (SPEC §5).
    for (let frame = 1; frame <= THUMB_FRAMES; frame++) {
      sketch.update?.(frame * THUMB_DT, THUMB_DT)
    }
    renderer.render(sketch.scene, sketch.camera)
    window.__SKETCH_READY__ = true
  } else {
    let start = 0
    let previous = 0
    let ready = false
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!start) {
        start = now
        previous = now
      }
      const t = (now - start) / 1000
      const dt = Math.min((now - previous) / 1000, 0.1)
      previous = now
      sketch.update?.(t, dt)
      renderer.render(sketch.scene, sketch.camera)
      if (!ready) {
        ready = true
        window.__SKETCH_READY__ = true
      }
    }
    raf = requestAnimationFrame(frame)
  }

  return {
    destroy: () => {
      if (raf) cancelAnimationFrame(raf)
      sketch.dispose?.()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    },
  }
}
