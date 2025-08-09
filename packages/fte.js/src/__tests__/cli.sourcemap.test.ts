import path from 'path'
import fs from 'fs'
import { build } from '../utils/build'

import os from 'os'

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

describe('CLI build sourcemap', () => {
  beforeAll(() => {
    // create a simple template file
    const tpl = "Hello, <%= name %>";
    fs.writeFileSync(path.join(tmpAbs, 'sample.njs'), tpl)
  })
  afterAll(() => {
    rimrafDir(outAbs)
    rimrafDir(tmpAbs)
  })

  test('should emit external map when --sourcemap --no-inline-map', done => {
    build(
      tmpAbs,
      outAbs,
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
      err => {
        try {
          expect(err).toBeUndefined()
          function list(dir: string): string[] {
            const entries = fs.readdirSync(dir)
            let acc: string[] = []
            for (const e of entries) {
              const p = path.join(dir, e)
              const st = fs.statSync(p)
              if (st.isDirectory()) acc = acc.concat(list(p))
              else acc.push(p)
            }
            return acc
          }
          const files = list(outAbs)
          const hasMap = files.some(f => f.endsWith('.map'))
          expect(hasMap).toBeTruthy()
          done()
        } catch (e) {
          done(e)
        }
      },
    )
  })

  test('should support esm format for singlefile bundle', done => {
    build(
      tmpAbs,
      outAbs,
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
      err => {
        try {
          expect(err).toBeUndefined()
          const out = fs.readFileSync(path.join(outAbs, 'bundle.esm.js'), 'utf8')
          expect(out).toMatch(/export const templates =/)
          done()
        } catch (e) {
          done(e)
        }
      },
    )
  })
})
