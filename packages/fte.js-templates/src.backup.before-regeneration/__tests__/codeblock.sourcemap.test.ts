import templates from '../index'
import { TemplateFactoryStandalone } from 'fte.js-standalone'

describe('Templates codeblock sourcemap', () => {
  test('should produce inline sourcemap when inline', () => {
    const F = new TemplateFactoryStandalone(templates as any)
    F.options = {
      ...F.options,
      sourceMap: true,
      inline: true,
      sourceFile: 'test.js',
      sourceRoot: '/root',
    } as any

    const blockList = [
      { type: 'text', content: 'Hello', eol: false, sourceFile: 'template.njs', originalStart: { line: 1, column: 1, source: 'template.njs' }},
      { type: 'uexpression', content: ' name ', eol: true, sourceFile: 'template.njs', originalStart: { line: 1, column: 6, source: 'template.njs' }},
    ] as any

    const res: any = F.run(blockList, 'codeblock.njs')
    expect(typeof res).toBe('object')
    expect(res.code).toMatch(/sourceMappingURL=data:application\/json;base64,/)
    expect(res.map).toBeDefined()
  })

  test('should reference external map when no inline', () => {
    const F = new TemplateFactoryStandalone(templates as any)
    F.options = {
      ...F.options,
      sourceMap: true,
      inline: false,
      sourceFile: 'test.js',
      sourceRoot: '/root',
    } as any

    const blockList = [
      { type: 'text', content: 'Hello', eol: false, sourceFile: 'template.njs', originalStart: { line: 1, column: 1, source: 'template.njs' }},
    ] as any

    const res: any = F.run(blockList, 'codeblock.njs')
    expect(typeof res).toBe('object')
    expect(res.code).toMatch(/\/\/\# sourceMappingURL=test.js.map/)
    expect(res.map).toBeDefined()
  })
})
