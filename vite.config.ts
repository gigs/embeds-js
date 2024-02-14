/// <reference types="vitest" />
/// <reference types="vite/client" />

import { resolve } from 'node:path'

import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [preact(), dts({ rollupTypes: true })],
  // esbuild: {
  //   define: {
  //     'process.env.NODE_ENV': '"production"',
  //   },
  // },
  build: {
    copyPublicDir: false,
    minify: 'esbuild',
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'GigsEmbeds',
      fileName: 'gigs-embeds',
    },
    rollupOptions: {
      // For the js-only version of this library, we need to bundle react and react-dom
      external: [],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./scripts/setupTests.ts'],
    pool: 'forks',
  },
})
