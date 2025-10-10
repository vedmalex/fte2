import { describe, expect, test } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from '../utils/build'

function tmpDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fte-'))
  return dir
}

function rmDir(dir: string) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    const st = fs.statSync(full)
    if (st.isDirectory()) rmDir(full)
    else fs.unlinkSync(full)
  }
  fs.rmdirSync(dir)
}

function runBuild(
  src: string,
  dest: string,
  options: Parameters<typeof build>[2],
) {
  return new Promise<void>((resolve, reject) => {
    build(
      src,
      dest,
      options,
      (err) => {
        if (err) reject(err instanceof Error ? err : new Error(String(err)))
        else resolve()
      },
    )
  })
}

describe('bundle adds context JSDoc/TS types', () => {
  test('JS bundle contains @typedef for context', async () => {
    const src = tmpDir()
    const dest = tmpDir()
    try {
      const tpl = 'Hello {{= name}}'
      fs.mkdirSync(path.join(src, 'a'), { recursive: true })
      fs.writeFileSync(path.join(src, 'a', 't.njs'), tpl)

      await runBuild(src, dest, {
        typescript: false,
        format: false,
        pretty: false,
        minify: false,
        standalone: false,
        single: true,
        ext: '.njs',
        file: 'bundle.js',
      })

      const out = fs.readFileSync(path.join(dest, 'bundle.js'), 'utf8')
      expect(out).toMatch(/@typedef\s+\{object\}\s+.*_Context/)
    } finally {
      rmDir(dest)
      rmDir(src)
    }
  })

  test('TS bundle contains interface for context', async () => {
    const src = tmpDir()
    const dest = tmpDir()
    try {
      const tpl = 'Hello {{= name}}'
      fs.mkdirSync(path.join(src, 'a'), { recursive: true })
      fs.writeFileSync(path.join(src, 'a', 't.njs'), tpl)

      await runBuild(src, dest, {
        typescript: true,
        format: false,
        pretty: false,
        minify: false,
        standalone: false,
        single: true,
        ext: '.njs',
        file: 'bundle.ts',
      })

      const out = fs.readFileSync(path.join(dest, 'bundle.ts'), 'utf8')
      expect(out).toMatch(/interface\s+.*_Context\s*\{/)
      expect(out).toMatch(
        /export function run\(context: ReturnType<typeof inferContext>, name\)/,
      )
    } finally {
      rmDir(dest)
      rmDir(src)
    }
  })
})
