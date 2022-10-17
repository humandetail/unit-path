import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {},

  build: {
    lib: {
      entry: './src/index.ts',
      name: 'UnitPath',
      fileName: 'unit-path',
      formats: ['es', 'cjs', 'iife'],
    },
  },
});
