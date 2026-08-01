import { defineConfig } from 'vite'

export default defineConfig({
  base: '/gen/',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 800,
  },
})
