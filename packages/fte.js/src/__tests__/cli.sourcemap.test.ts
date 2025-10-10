import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { build } from '../utils/build'

const repoRoot = path.resolve(__dirname, '..', '..', '..')
const tmpAbs = fs.mkdtempSync(path.join(os.tmpdir(), 'fte-src-'))
const outAbs = fs.mkdtempSync(path.join(os.tmpdir(), 'fte-out-'))

function rimrafDir(dir: string) {
  if (fs.existsSync(dir)) {
    for (const e of fs.readdirSync(dir)) {
      const p = path.join(dir, e)
      const st = fs.statSync(p)
      if (st.isDirectory()) rimrafDir(p)
      else fs.unlinkSync(p)
    }
    fs.rmdirSync(dir)
  }
}

async function runBuildAndVerify(
  options: Parameters<typeof build>[2],
  verify: () => void,
) {
  fs.rmSync(outAbs, { recursive: true, force: true })
  fs.mkdirSync(outAbs, { recursive: true })
  await new Promise<void>((resolve, reject) => {
    build(
      tmpAbs,
      outAbs,
      options,
      (err) => {
        if (err) {
          reject(err instanceof Error ? err : new Error(String(err)))
          return
        }
        try {
          verify()
          resolve()
        } catch (error) {
          reject(error as Error)
        }
      },
    )
  })
}

function listFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir)
  let acc: string[] = []
  for (const e of entries) {
    const p = path.join(dir, e)
    const st = fs.statSync(p)
    if (st.isDirectory()) acc = acc.concat(listFiles(p))
    else acc.push(p)
  }
  return acc
}

describe('CLI build sourcemap', () => {
  beforeAll(() => {
    // create a simple template file
    const tpl = 'Hello, <%= name %>'
    fs.writeFileSync(path.join(tmpAbs, 'sample.njs'), tpl)
  })
  afterAll(() => {
    rimrafDir(outAbs)
    rimrafDir(tmpAbs)
  })

  test('should emit external map when --sourcemap --no-inline-map', async () => {
    await runBuildAndVerify(
      {
        typescript: false,
        format: false,
        pretty: false,
        minify: false,
        standalone: false,
        single: false,
        ext: '.njs',
        file: 'index',
        sourcemap: true,
        inlineMap: false,
      },
      () => {
        const files = listFiles(outAbs)
        const hasMap = files.some((f) => f.endsWith('.map'))
        expect(hasMap).toBeTruthy()
      },
    )
  })

  test('should support esm format for singlefile bundle', async () => {
    await runBuildAndVerify(
      {
        typescript: false,
        format: 'esm' as any,
        pretty: false,
        minify: false,
        standalone: false,
        single: true,
        ext: '.njs',
        file: 'bundle.esm',
        sourcemap: false,
        inlineMap: true,
      },
      () => {
        const out = fs.readFileSync(
          path.join(outAbs, 'bundle.esm.js'),
          'utf8',
        )
        expect(out).toMatch(/export const templates =/)
      },
    )
  })

  test('should support esm format for standalone index bundle', async () => {
    await runBuildAndVerify(
      {
        typescript: false,
        format: 'esm' as any,
        pretty: false,
        minify: false,
        standalone: true,
        single: false,
        ext: '.njs',
        file: 'index',
        sourcemap: false,
        inlineMap: true,
      },
      () => {
        const files = listFiles(outAbs)
        const hasImports = files
          .filter((f) => f.endsWith('.js'))
          .some((f) =>
            /import\s+.*from\s+['"]/m.test(fs.readFileSync(f, 'utf8')),
          )
        expect(hasImports).toBeTruthy()
      },
    )
  })
})
