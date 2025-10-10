import { build } from 'esbuild'
import { builtinModules } from 'node:module'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createConfig } from '../../../shared/bun.config.ts'

const pkg = JSON.parse(
  readFileSync(join(__dirname, 'package.json'), 'utf-8'),
) as any

const esbuildConfig = createConfig({
  pkg,
  entrypoints: ['src/server.ts'],
  format: 'cjs',
  sourcemap: 'external',
  enableDependencyChecker: false,
  packages: 'bundle',
})

esbuildConfig.outfile = './dist/server.js'

const externals = new Set<string>()
for (const mod of builtinModules) {
  externals.add(mod)
  if (!mod.startsWith('node:')) externals.add(`node:${mod}`)
}

esbuildConfig.external = Array.from(externals)

await build(esbuildConfig)
