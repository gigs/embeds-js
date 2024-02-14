/// <reference types="vitest" />
/// <reference types="vite/client" />

import { resolve } from 'node:path'

import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [preact(), dts({ rollupTypes: true })],
  build: {
    copyPublicDir: false,
    minify: 'esbuild',
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'GigsEmbeds',
      fileName: 'gigs-embeds',
    },
    rollupOptions: {
      // No peer dependencies
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
