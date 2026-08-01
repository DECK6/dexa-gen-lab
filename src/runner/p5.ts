import P5 from 'p5'
import { DEXA_PALETTE } from '../palette'
import { mulberry32 } from '../prng'
import type { P5SketchFn, SketchCtx } from '../types'
import { THUMB_FRAMES, type MountOptions, type SketchHandle } from './index'

export function mount(
  container: HTMLElement,
  fn: P5SketchFn,
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
  let ready = false

  const instance = new P5((p) => {
    fn(p, ctx)
    const userSetup = typeof p.setup === 'function' ? p.setup.bind(p) : undefined
    const userDraw = typeof p.draw === 'function' ? p.draw.bind(p) : undefined

    p.setup = () => {
      // Injected immediately before user setup so p.random / p.noise are seeded (SPEC §3).
      p.randomSeed(ctx.seed)
      p.noiseSeed(ctx.seed)
      return userSetup?.()
    }

    p.draw = () => {
      userDraw?.()
      if (options.thumb) {
        if (p.frameCount < THUMB_FRAMES) return
        p.noLoop()
      }
      if (!ready) {
        ready = true
        window.__SKETCH_READY__ = true
      }
    }
  }, container)

  return {
    destroy: () => instance.remove(),
  }
}
