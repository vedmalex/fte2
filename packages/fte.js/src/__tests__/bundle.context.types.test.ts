import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from '../utils/build'

function tmpDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fte-'))
  return dir
}

describe('bundle adds context JSDoc/TS types', () => {
  test('JS bundle contains @typedef for context', done => {
    const src = tmpDir()
    const dest = tmpDir()
    const tpl = `Hello {{= name}}`
    fs.mkdirSync(path.join(src, 'a'), { recursive: true })
    fs.writeFileSync(path.join(src, 'a', 't.njs'), tpl)

    build(src, dest, { typescript: false, format: false, pretty: false, minify: false, standalone: false, single: true, ext: '.njs', file: 'bundle.js' }, err => {
      expect(err).toBeFalsy()
      const out = fs.readFileSync(path.join(dest, 'bundle.js'), 'utf8')
      expect(out).toMatch(/@typedef\s+\{object\}\s+.*_Context/)
      done()
    })
  })

  test('TS bundle contains interface for context', done => {
    const src = tmpDir()
    const dest = tmpDir()
    const tpl = `Hello {{= name}}`
    fs.mkdirSync(path.join(src, 'a'), { recursive: true })
    fs.writeFileSync(path.join(src, 'a', 't.njs'), tpl)

    build(src, dest, { typescript: true, format: false, pretty: false, minify: false, standalone: false, single: true, ext: '.njs', file: 'bundle.ts' }, err => {
      expect(err).toBeFalsy()
      const out = fs.readFileSync(path.join(dest, 'bundle.ts'), 'utf8')
      expect(out).toMatch(/interface\s+.*_Context\s*\{/)
      expect(out).toMatch(/export function run\(context: ReturnType<typeof inferContext>, name\)/)
      done()
    })
  })
})
