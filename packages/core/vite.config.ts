import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// npm build: ESM + CJS, with `kalpa-shan` and `kalpa-shan/element` entry points.
// The CDN bundle is built separately by vite.cdn.config.ts (IIFE can't have multiple entries).
export default defineConfig({
  build: {
    lib: {
      entry: { 'kalpa-shan': 'src/index.ts', element: 'src/element.ts' },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    sourcemap: true,
  },
  plugins: [dts({ include: ['src'], exclude: ['src/cdn.ts'] })],
})
