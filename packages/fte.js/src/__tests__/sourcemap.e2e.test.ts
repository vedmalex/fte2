import { afterAll, describe, expect, test } from 'vitest'
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

  const runBuild = async (options: Parameters<typeof build>[2]) => {
    fs.rmSync(dest, { recursive: true, force: true })
    fs.mkdirSync(dest, { recursive: true })
    await new Promise<void>((resolve, reject) => {
      build(
        src,
        dest,
        options,
        (err) => {
          if (err) {
            reject(err instanceof Error ? err : new Error(String(err)))
          } else {
            resolve()
          }
        },
      )
    })
  }

  afterAll(() => {
    rimrafDir(dest)
    rimrafDir(src)
  })

  test('generates external .map with correct sources and mapping url', async () => {
    const tpl = [
      'Hello ',
      '<% const x = 1; %>',
      '<%= name %>\n',
      'Line2\n',
    ].join('')
    const subdir = path.join(src, 'a')
    fs.mkdirSync(subdir, { recursive: true })
    const inFile = path.join(subdir, 'sample.njs')
    fs.writeFileSync(inFile, tpl)

    await runBuild({
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
    })

    const outJs = path.join(dest, 'a', 'sample.njs.js')
    const outMap = outJs + '.map'
    expect(fs.existsSync(outJs)).toBeTruthy()
    expect(fs.existsSync(outMap)).toBeTruthy()

    const code = fs.readFileSync(outJs, 'utf8')
    expect(code).toMatch(/\/\/# sourceMappingURL=.*\.map\s*$/m)

    const map = JSON.parse(fs.readFileSync(outMap, 'utf8'))
    expect(Array.isArray(map.sources)).toBeTruthy()
    const sourcesStr = map.sources.join('\n')
    expect(sourcesStr).toMatch(/a\/sample\.njs/i)
    expect(typeof map.mappings).toBe('string')
    expect(map.mappings.length).toBeGreaterThan(0)
    const codeLines = code.split(/\r?\n/).length
    const mappingLines = String(map.mappings).split(';').length
    expect(mappingLines).toBeGreaterThanOrEqual(
      Math.max(1, Math.floor(codeLines * 0.7)),
    )
  })

  test('map contains sourcesContent with original template', async () => {
    const tpl = ['Alpha ', '<% const y = 2; %>', '<%= who %>\n', 'Beta\n'].join(
      '',
    )
    const subdir = path.join(src, 'b')
    fs.mkdirSync(subdir, { recursive: true })
    const inFile = path.join(subdir, 'orig.njs')
    fs.writeFileSync(inFile, tpl)

    await runBuild({
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
    })

    const outJs = path.join(dest, 'b', 'orig.njs.js')
    const outMap = outJs + '.map'
    const code = fs.readFileSync(outJs, 'utf8')
    expect(code).toMatch(/sourceMappingURL=.*\.map\s*$/m)
    const map = JSON.parse(fs.readFileSync(outMap, 'utf8'))
    expect(Array.isArray(map.sourcesContent)).toBeTruthy()
    const sc = (map.sourcesContent || []).join('\n')
    expect(sc).toContain('Alpha ')
    expect(sc).toContain('<% const y = 2; %>')
    expect(sc).toContain('<%= who %>')
  })
})
