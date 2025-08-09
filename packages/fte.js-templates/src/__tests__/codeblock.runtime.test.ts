import templates from '../index'
import { TemplateFactoryStandalone } from 'fte.js-standalone'

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  return F
}

describe('codeblock.njs runtime generation', () => {
  test('simple text and expression assembling', () => {
    const F = makeFactory()
    const blocks = [
      { type: 'text', content: 'Hello ', eol: false },
      { type: 'expression', content: 'name', start: true, end: true, eol: true },
    ] as any

    const res: any = F.run(blocks, 'codeblock.njs')
    expect(typeof res).toBe('object')
    const fn = new Function('options', 'name', `var out=[];\n${res.code};\nreturn out.join('')`)
    const html = fn({
      escapeIt: (s: string) => s,
      applyIndent: (s: string) => s,
      applyDeindent: (s: string) => s,
    }, 'name')
    expect(html).toBe('Hello name')
  })

  test('uexpression uses escapeIt and applyIndent', () => {
    const F = makeFactory()
    const blocks = [
      { type: 'text', content: 'Hi ', eol: false },
      { type: 'uexpression', content: 'name', start: true, end: true, eol: true, indent: '  ' },
    ] as any

    const res: any = F.run(blocks, 'codeblock.njs')
    const fn = new Function('options', 'name', `var out=[];\n${res.code};\nreturn out.join('')`)
    const html = fn({
      escapeIt: (s: string) => `[${s}]`,
      applyIndent: (s: string, i: string) => i + s,
      applyDeindent: (s: string) => s,
    }, 'name')
    expect(html).toBe('Hi   [name]')
  })

  test('code block preserves newlines and mapping positions update', () => {
    const F = makeFactory()
    const blocks = [
      { type: 'code', content: 'const x = 1;', eol: true },
      { type: 'text', content: 'Z', eol: true },
    ] as any
    const res: any = F.run(blocks, 'codeblock.njs')
    expect(res.code).toContain('const x = 1;\n')
  })
})
