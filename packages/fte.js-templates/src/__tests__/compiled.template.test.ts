import { describe, expect, test } from 'vitest'
import { TemplateFactoryStandalone } from 'fte.js-standalone'
import templates from '../index'

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  return F
}

function textBlock(content: string, withEol = true) {
  return [{ type: 'text', content, eol: withEol }] as any
}

describe('compiled.njs', () => {
  test('returns string when inner template returns string', () => {
    const F = makeFactory()

    const ctx: any = {
      // The compiled.njs expects context for MainTemplate.njs
      directives: {
        context: 'context',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
        blocks: {},
        slots: {},
      },
      blocks: {},
      slots: {},
      main: textBlock('Hello'),
    }

    const core: any = F.run(ctx, 'MainTemplate.njs')
    expect(typeof core).toBe('object')

    // Now pass same ctx through compiled.njs which internally runs core
    const res: any = F.run(ctx, 'compiled.njs')
    expect(typeof res).toBe('object')
    expect(res.code).toContain('module.exports = ')
  })

  test('propagates map when inner returns {code,map}', () => {
    const F = makeFactory()
    F.options = {
      ...F.options,
      sourceMap: true,
      inline: true,
      sourceFile: 'a.js',
      sourceRoot: '/',
    } as any

    const ctx: any = {
      directives: {
        context: 'context',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
        blocks: {},
        slots: {},
      },
      blocks: {},
      slots: {},
      main: [
        {
          type: 'text',
          content: 'A',
          eol: true,
          sourceFile: 't.njs',
          originalStart: { line: 1, column: 1 },
        },
      ] as any,
    }

    const res: any = F.run(ctx, 'compiled.njs')
    expect(typeof res).toBe('object')
    expect(res.code).toContain('module.exports = ')
    expect(res.map).toBeDefined()
  })
})
