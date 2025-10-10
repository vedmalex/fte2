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

describe('MainTemplate.njs - basic generation', () => {
  test('generates code with main content and no chunks', () => {
    const F = makeFactory()

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
      main: textBlock('Hello'),
    }

    const res: any = F.run(ctx, 'MainTemplate.njs')
    expect(typeof res).toBe('object')
    expect(typeof res.code).toBe('string')

    expect(res.code).toContain(
      'script: function (context, _content, partial, slot, options)',
    )
    // Last block has eol cleared by template, so no \n
    expect(res.code).toContain('out.push("Hello");')
    expect(res.map).toBeUndefined()
  })

  test('includes blocks section when blocks are defined', () => {
    const F = makeFactory()

    const header = {
      directives: {
        context: 'ctx',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
      },
      main: textBlock('Header'),
    }

    const ctx: any = {
      directives: {
        context: 'context',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
        blocks: { header },
        slots: {},
      },
      blocks: { header },
      slots: {},
      main: textBlock('Body'),
    }

    const res: any = F.run(ctx, 'MainTemplate.njs')
    expect(res.code).toContain('blocks : {')
    expect(res.code).toContain('"header": function(')
    expect(res.code).toContain('out.push("Header");')
  })

  test('adds chunk infrastructure when chunks directive is provided', () => {
    const F = makeFactory()

    const ctx: any = {
      directives: {
        context: 'context',
        content: false,
        chunks: 'main',
        alias: undefined,
        deindent: false,
        requireAs: [],
        blocks: {},
        slots: {},
        includeMainChunk: false,
        useHash: false,
      },
      blocks: {},
      slots: {},
      main: textBlock('X'),
    }

    const res: any = F.run(ctx, 'MainTemplate.njs')
    expect(res.code).toContain('const _partial = partial')
    expect(res.code).toContain('function chunkStart(')
    expect(res.code).toContain("if(out.some(t=>typeof t == 'object')){")
  })
})
