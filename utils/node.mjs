import { NodeResolvePlugin } from '@esbuild-plugins/node-resolve'
import { build } from 'esbuild'

build({
  entryPoints: ['src/node/index.ts'],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  sourcemap: 'external',
  minify: false,
  logOverride: {
    'direct-eval': 'info',
  },
  outfile: 'lib/node.fte.js',
  plugins: [
    NodeResolvePlugin({
      extensions: ['.ts', '.js'],
      onResolved: (resolved) => {
        if (resolved.includes('node_modules')) {
          return {
            external: true,
          }
        } else {
          // console.log(resolved)
        }
        return resolved
      },
    }),
  ],
})
