import type { SketchMeta } from '../../src/types'

export default {
  id: 'FR04',
  slug: 'mandel-drift',
  title: 'MANDEL DRIFT',
  category: 'fractal',
  engine: 'p5',
  tags: ['mandelbrot', 'zoom', 'pixel-buffer'],
  description: '만델브로트 경계를 따라 표류하는 느린 줌 (저해상 버퍼)',
} satisfies SketchMeta
