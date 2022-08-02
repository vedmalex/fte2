import { build } from 'esbuild'

build({
  entryPoints: ['src/standalone/index.ts'],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  outfile: 'lib/standalone.fte.js',
  sourcemap: 'external',
  minify: false,
})

build({
  entryPoints: ['src/templates/index.ts'],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  outfile: 'lib/templates.js',
  sourcemap: 'external',
  minify: false,
})
