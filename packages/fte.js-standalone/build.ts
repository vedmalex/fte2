import { build } from 'esbuild'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createConfig } from '../../shared/bun.config.ts'

const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'))

const entrypoints = ['src/index.ts', 'src/compile.ts', 'src/compileFull.ts', 'src/compileLight.ts', 'src/compileTs.ts', 'src/parseFile.ts', 'src/run.ts']
const format = process.env.FORMAT || 'cjs'

const esbuildConfig = createConfig({
  pkg: pkg as any,
  entrypoints,
  outdir: `./dist`,
  format: format as 'cjs' | 'esm',
  sourcemap: 'external',
  enableDependencyChecker: false,
  enableBundleAnalysis: false,
  packages: 'external',
})

await build(esbuildConfig)
