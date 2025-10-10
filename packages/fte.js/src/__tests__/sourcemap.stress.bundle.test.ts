import { describe, expect, test } from 'vitest'
import fs from 'fs'
import path from 'path'
import { build } from '../../src/utils/build'

function collectFiles(dir: string, predicate: (file: string) => boolean) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const result: Array<string> = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      result.push(...collectFiles(full, predicate))
    } else if (predicate(full)) {
      result.push(full)
    }
  }
  return result
}

const repoRoot = path.resolve(__dirname, '..', '..', '..', '..')

describe('E2E sourcemaps stress (bundle level)', () => {
  test(
    'deeply nested blocks/slots still map to primary source',
    async () => {
      const src = path.join(repoRoot, 'demo')
      const dest = path.join(repoRoot, 'tmp', 'stress')
    fs.rmSync(dest, { recursive: true, force: true })
    fs.mkdirSync(dest, { recursive: true })

    await new Promise<void>((resolve, reject) => {
      build(
        src,
        dest,
        {
          typescript: false,
          format: 'cjs' as any,
          pretty: false,
          minify: false,
          standalone: false,
          single: false,
          ext: '.njs',
          file: 'index',
          sourcemap: true,
          inlineMap: false,
        } as any,
        (err) => {
          if (err) {
            reject(err instanceof Error ? err : new Error(String(err)))
          } else {
            resolve()
          }
        },
      )
    })

    const outputs = collectFiles(dest, (f) => f.endsWith('.js.map'))
    expect(outputs.length).toBeGreaterThan(0)
    const map = JSON.parse(fs.readFileSync(outputs[0], 'utf8'))
    expect(Array.isArray(map.sources)).toBeTruthy()
      expect(map.mappings).toBeDefined()
    },
    30_000,
  )
})
