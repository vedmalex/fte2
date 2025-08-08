import path from 'path'
import fs from 'fs'
import { build } from '../utils/build'
import os from 'os'

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

describe('CLI build inline sourcemap', () => {
  beforeAll(() => {
    const tpl = "Hello, <%= name %>";
    fs.writeFileSync(path.join(tmpAbs, 'sample.njs'), tpl)
  })
  afterAll(() => {
    rimrafDir(outAbs)
    rimrafDir(tmpAbs)
  })

  test('should embed inline data url and not emit .map', done => {
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
        inlineMap: true,
      },
      err => {
        try {
          expect(err).toBeUndefined()
          const files = list(outAbs)
          const hasAnyMapFile = files.some(f => f.endsWith('.map'))
          expect(hasAnyMapFile).toBeFalsy()

          const jsFiles = files.filter(f => f.endsWith('.js'))
          const hasInline = jsFiles.some(f => fs.readFileSync(f, 'utf8').includes('sourceMappingURL=data:application/json;base64,'))
          expect(hasInline).toBeTruthy()
          done()
        } catch (e) {
          done(e)
        }
      },
    )
  })
})
