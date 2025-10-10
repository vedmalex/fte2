import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    globals: true,
    reporters: ['default'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.d.ts',
        'src/**/*.test.ts',
        'src/**/*.bench.ts',
        'dist/',
        'types/',
      ],
    },
    benchmark: {
      include: ['src/**/*.bench.ts'],
      reporters: ['verbose'],
      outputFile: {
        json: './benchmarks/results.json',
        html: './benchmarks/index.html',
      },
    },
  },
})
