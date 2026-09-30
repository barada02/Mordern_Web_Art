import { defineConfig } from 'vite'

// CDN bundle: one self-contained, minified script exposing `window.Shanshui`
// and registering <shan-shui>.
export default defineConfig({
  build: {
    lib: {
      entry: 'src/cdn.ts',
      name: 'Shanshui',
      formats: ['iife'],
      fileName: () => 'shanshui.iife.js',
    },
    emptyOutDir: false,
    sourcemap: true,
  },
})
