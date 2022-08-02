import { build } from 'esbuild'

build({
  entryPoints: ['src/browser/index.ts'],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  sourcemap: 'external',
  outfile: 'lib/browser.fte.js',
})
