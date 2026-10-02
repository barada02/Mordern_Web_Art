import { defineConfig } from 'vite'

// CDN bundle: one self-contained, minified script exposing `window.KalpaShan`
// and registering <kalpa-shan>.
export default defineConfig({
  build: {
    lib: {
      entry: 'src/cdn.ts',
      name: 'KalpaShan',
      formats: ['iife'],
      fileName: () => 'kalpa-shan.iife.js',
    },
    emptyOutDir: false,
    sourcemap: true,
  },
})
