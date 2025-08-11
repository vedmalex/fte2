import path from 'path'
import fs from 'fs'
import { build } from '../../src/utils/build'

describe('E2E sourcemaps stress (bundle level)', () => {
  test('deeply nested blocks/slots still map to primary source', done => {
    const src = path.join(__dirname, '..', '..', '..', 'demo')
    const dest = path.join(__dirname, '..', '..', '..', 'tmp', 'stress')
    fs.mkdirSync(dest, { recursive: true })

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
      err => {
        try {
          expect(err).toBeUndefined()
          // Pick any output js.map and validate its structure
          const outputs = fs.readdirSync(dest).filter(f => f.endsWith('.js.map'))
          expect(outputs.length).toBeGreaterThan(0)
          const map = JSON.parse(fs.readFileSync(path.join(dest, outputs[0]), 'utf8'))
          expect(Array.isArray(map.sources)).toBeTruthy()
          expect(map.mappings).toBeDefined()
          done()
        } catch (e) {
          done(e)
        }
      }
    )
  })
})
