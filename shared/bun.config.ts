import { builtinModules } from 'node:module'
import path from 'node:path'
import type { BuildOptions, Plugin } from 'esbuild'

interface BuilderConfig {
  entrypoints?: string[] | string
  outdir?: string
  outfile?: string
  format?: 'esm' | 'cjs'
  target?: 'node'
  external?: string[]
  sourcemap?: 'inline' | 'external' | boolean
  pkg: {
    dependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  define?: Record<string, string>
  plugins?: any[]
  enableDependencyChecker?: boolean
  enableBundleAnalysis?: boolean
  packages?: 'external' | 'bundle'
}

function createDependencyCheckerPlugin(pkg: BuilderConfig['pkg']): Plugin {
  const allowedDependencies = new Set([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ])

  return {
    name: 'dependency-checker',
    setup(build) {
      build.onResolve({ filter: /^[^./]/ }, (args) => {
        if (
          !args.path.startsWith('node:') &&
          !allowedDependencies.has(args.path)
        ) {
          throw new Error(
            `❌ Package "${args.path}" is not declared in package.json dependencies.\n` +
            `📦 Please install it explicitly: bun add ${args.path}\n` +
            `📋 Allowed dependencies: ${Array.from(allowedDependencies).join(', ')}`,
          )
        }
        return null
      })
    },
  }
}

export function createConfig(config: BuilderConfig): BuildOptions {
  const {
    entrypoints = ['src/index.ts'],
    outdir = './dist',
    outfile,
    format = 'cjs',
    target = 'node',
    sourcemap = 'inline',
    pkg,
    external = [],
    plugins = [],
    enableDependencyChecker = false,
    enableBundleAnalysis = false,
    packages = 'bundle',
  } = config

  let finalOutfile = outfile
  if (!finalOutfile) {
    const entryArray = Array.isArray(entrypoints) ? entrypoints : [entrypoints]
    const outputFile = path.basename(entryArray[0])
    const outputName = outputFile.replace(/\.[^/.]+$/, '')
    finalOutfile =
      format === 'esm'
        ? `./dist/${outputName}.esm.js`
        : `./dist/${outputName}.js`
  }

  const allPlugins = [...plugins]

  if (enableDependencyChecker) {
    allPlugins.push(createDependencyCheckerPlugin(pkg))
  }

  const esbuildConfig: BuildOptions = {
    entryPoints: Array.isArray(entrypoints) ? entrypoints : [entrypoints],
    bundle: true,
    format,
    platform: target as 'node',
    sourcemap,
    plugins: allPlugins,
  }

  // Use outdir for multiple entrypoints, outfile for single entrypoint
  const entryArray = Array.isArray(entrypoints) ? entrypoints : [entrypoints]
  if (entryArray.length > 1 || config.outdir) {
    esbuildConfig.outdir = config.outdir || './dist'
    if (format === 'esm') {
      esbuildConfig.outExtension = {
        '.js': '.esm.js',
      }
    }
  } else {
    esbuildConfig.outfile = finalOutfile
  }

  if (packages === 'external') {
    esbuildConfig.packages = 'external'
  } else {
    esbuildConfig.external = Object.keys(pkg.dependencies || {})
      .concat(Object.keys(pkg.peerDependencies || {}))
      .concat(Object.keys(pkg.devDependencies || {}))
      .concat(builtinModules)
      .concat(external)
  }

  return esbuildConfig
}
