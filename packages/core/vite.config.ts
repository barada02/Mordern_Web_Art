import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Shanshui',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'shanshui.js' : 'shanshui.umd.cjs'),
    },
    sourcemap: true,
  },
  plugins: [dts({ include: ['src'] })],
})
