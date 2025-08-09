import templates from '../index'
import { TemplateFactoryStandalone } from 'fte.js-standalone'

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  return F
}

function textBlock(content: string, withEol = true) {
  return [{ type: 'text', content, eol: withEol }] as any
}

function getCode(res: any): string {
  return typeof res === 'string' ? res : res.code
}

describe('MainTemplate.ts.njs vs MainTemplate.njs - structural equivalence', () => {
  test('basic script generation without blocks/slots/chunks', () => {
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

    const jsRes: any = F.run(ctx, 'MainTemplate.njs')
    const tsRes: any = F.run(ctx, 'MainTemplate.ts.njs')

    const jsCode = getCode(jsRes)
    const tsCode = getCode(tsRes)

    expect(jsCode).toContain('script: function (context, _content, partial, slot, options)')
    expect(tsCode).toContain('script: function (context, _content, partial, slot, options)')

    expect(jsCode).toContain('out.push("Hello");')
    expect(tsCode).toContain('out.push("Hello");')

    expect(jsCode).not.toContain('blocks : {')
    expect(tsCode).not.toContain('blocks : {')
    expect(jsCode).not.toContain('slots : {')
    expect(tsCode).not.toContain('slots : {')
  })

  test('blocks presence and body insertion', () => {
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

    const jsCode = getCode(F.run(ctx, 'MainTemplate.njs'))
    const tsCode = getCode(F.run(ctx, 'MainTemplate.ts.njs'))

    for (const code of [jsCode, tsCode]) {
      expect(code).toContain('blocks : {')
      expect(code).toContain('"header": function(')
      expect(code).toContain('out.push("Header");')
    }
  })

  test('slots presence and body insertion', () => {
    const F = makeFactory()

    const footer = {
      directives: {
        context: 'ctx',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
      },
      main: textBlock('Footer'),
    }

    const ctx: any = {
      directives: {
        context: 'context',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
        blocks: { footer },
        slots: { footer },
      },
      blocks: { footer },
      slots: { footer },
      main: textBlock('Body'),
    }

    const jsCode = getCode(F.run(ctx, 'MainTemplate.njs'))
    const tsCode = getCode(F.run(ctx, 'MainTemplate.ts.njs'))

    for (const code of [jsCode, tsCode]) {
      expect(code).toContain('slots : {')
      expect(code).toContain('"footer": function(')
      expect(code).toContain('out.push("Footer");')
    }
  })

  test('chunks plumbing exists in both when chunks directive is provided', () => {
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

    const jsCode = getCode(F.run(ctx, 'MainTemplate.njs'))
    const tsCode = getCode(F.run(ctx, 'MainTemplate.ts.njs'))

    for (const code of [jsCode, tsCode]) {
      expect(code).toContain('const _partial = partial')
      expect(code).toContain('function chunkStart(')
      expect(code).toContain("if(out.some(t=>typeof t == 'object')){")
    }
  })
})
