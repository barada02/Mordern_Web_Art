import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// npm build: ESM + CJS, with `shanshui` and `shanshui/element` entry points.
// The CDN bundle is built separately by vite.cdn.config.ts (IIFE can't have multiple entries).
export default defineConfig({
  build: {
    lib: {
      entry: { shanshui: 'src/index.ts', element: 'src/element.ts' },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    sourcemap: true,
  },
  plugins: [dts({ include: ['src'], exclude: ['src/cdn.ts'] })],
})
