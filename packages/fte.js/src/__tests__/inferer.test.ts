import { Inferer } from '..'
import fs from 'node:fs'
import path from 'node:path'

describe('fte.js Inferer', () => {
  const tempDir = path.join(__dirname, '__temp__')
  const file = path.join(tempDir, 'a.js')
  const tsfile = path.join(tempDir, 'b.ts')

  beforeAll(() => {
    fs.mkdirSync(tempDir, { recursive: true })
    fs.writeFileSync(file, `
function sum(a, b){
  return a + b
}
const arr = []
arr.push(10)
const o = { x: 1 }
o.y = 'str'
window
`, 'utf8')
    fs.writeFileSync(tsfile, `
export function hello(x: string){
  return x
}
`, 'utf8')
  })

  afterAll(() => {
    try { fs.rmSync(tempDir, { recursive: true, force: true }) } catch {}
    try { fs.rmSync(path.join(process.cwd(), 'globals.d.ts'), { force: true }) } catch {}
  })

  test('inferTypesInFiles generates d.ts and report', () => {
    const { report, globalsFile } = Inferer.inferTypesInFiles({
      cwd: tempDir,
      allowed: ['js', 'ts'],
      ignore: ['**/node_modules/**'],
      knownGlobals: ['window'],
      reportFile: path.join(tempDir, 'report.json'),
      exportFunctions: ['hello'],
    }) as any

    const dtsA = fs.readFileSync(file.replace(/\.js$/, '.d.ts'), 'utf8')
    const dtsB = fs.readFileSync(tsfile.replace(/\.ts$/, '.d.ts'), 'utf8')

    expect(dtsA).toMatch(/declare function sum\(a: number.*b: number.*\): number;/)
    // arr may be inferred as union like any[] | number[] | ...
    expect(dtsA).toMatch(/declare const arr:.*\[\]/)
    expect(dtsA).toMatch(/declare const o: \{ "x": number; "y": string \};/)

    expect(dtsB).toMatch(/export function hello\(x: any\): any;/)

    const globals = fs.readFileSync(globalsFile, 'utf8')
    expect(globals).not.toMatch(/window/)

    const rep = JSON.parse(fs.readFileSync(path.join(tempDir, 'report.json'), 'utf8'))
    expect(rep.files).toBeTruthy()
  })
})
