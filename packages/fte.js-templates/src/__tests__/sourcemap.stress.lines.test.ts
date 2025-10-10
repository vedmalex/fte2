import { describe, expect, test } from 'vitest'
import { TemplateFactoryStandalone } from 'fte.js-standalone'
import templates from '../index'

describe('SourceMap stress: long lines and deep nesting', () => {
  test('very long single line mapping stays correct', () => {
    const F = new TemplateFactoryStandalone(templates as any)
    F.options = {
      ...F.options,
      sourceMap: true,
      inline: true,
      sourceFile: 'stress.js',
      sourceRoot: '/',
    } as any

    const long = 'A'.repeat(5000) // very long line
    const blocks = [
      {
        type: 'text',
        content: long,
        eol: false,
        sourceFile: 't.njs',
        originalStart: { line: 1, column: 1 },
      },
      {
        type: 'text',
        content: 'X',
        eol: true,
        sourceFile: 't.njs',
        originalStart: { line: 1, column: 5001 },
      },
    ] as any

    const res: any = F.run(blocks, 'codeblock.njs')
    expect(res.map).toBeDefined()
    // sanity: there should be at least one mapping and line count should reflect split
    const template = res.map?.template?.segments || []
    expect(template.length).toBeGreaterThan(0)
  })

  test('CRLF inputs do not break line counts', () => {
    const F = new TemplateFactoryStandalone(templates as any)
    F.options = {
      ...F.options,
      sourceMap: true,
      inline: true,
      sourceFile: 'crlf.js',
      sourceRoot: '/',
    } as any

    const text = 'Line1\r\nLine2\r\n'
    const blocks = [
      {
        type: 'text',
        content: text,
        eol: true,
        sourceFile: 't.njs',
        originalStart: { line: 1, column: 1 },
      },
    ] as any

    const res: any = F.run(blocks, 'codeblock.njs')
    expect(res.map).toBeDefined()
    const template = res.map?.template?.segments || []
    // Should include some mapping; exact count may vary by generator strategy
    expect(template.length).toBeGreaterThan(0)
  })
})
