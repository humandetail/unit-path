import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  test: {},

  build: {
    lib: {
      entry: './src/index.ts',
      name: 'UnitPath',
      fileName: 'unit-path',
      formats: ['es', 'cjs', 'iife']
    }
  },

  plugins: [
    dts()
  ]
})
