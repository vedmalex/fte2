import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from '../utils/build'

function tmpDir(prefix: string) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix))
}

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

describe('E2E sourcemaps (compile → bundle → run)', () => {
  const src = tmpDir('fte-e2e-src-')
  const dest = tmpDir('fte-e2e-out-')

  afterAll(() => {
    rimrafDir(dest)
    rimrafDir(src)
  })

  test('generates external .map with correct sources and mapping url', done => {
    const tpl = [
      "Hello ",
      "<% const x = 1; %>",
      "<%= name %>\n",
      "Line2\n",
    ].join('')
    const subdir = path.join(src, 'a')
    fs.mkdirSync(subdir, { recursive: true })
    const inFile = path.join(subdir, 'sample.njs')
    fs.writeFileSync(inFile, tpl)

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
      },
      err => {
        try {
          expect(err).toBeUndefined()
          const outJs = path.join(dest, 'a', 'sample.njs.js')
          const outMap = outJs + '.map'
          expect(fs.existsSync(outJs)).toBeTruthy()
          expect(fs.existsSync(outMap)).toBeTruthy()

          const code = fs.readFileSync(outJs, 'utf8')
          expect(code).toMatch(/\/\/\# sourceMappingURL=.*\.map\s*$/m)

          const map = JSON.parse(fs.readFileSync(outMap, 'utf8'))
          expect(Array.isArray(map.sources)).toBeTruthy()
          // sources should contain original template path fragment
          const sourcesStr = map.sources.join('\n')
          expect(sourcesStr).toMatch(/a\/sample\.njs/i)
          // mappings string should be non-empty
          expect(typeof map.mappings).toBe('string')
          expect(map.mappings.length).toBeGreaterThan(0)
          // mapping lines should roughly track generated code lines
          const codeLines = code.split(/\r?\n/).length
          const mappingLines = String(map.mappings).split(';').length
          expect(mappingLines).toBeGreaterThanOrEqual(Math.max(1, Math.floor(codeLines * 0.7)))
          done()
        } catch (e) {
          done(e)
        }
      },
    )
  })
})
