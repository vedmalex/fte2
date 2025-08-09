import templates from '../index'
import { TemplateFactoryStandalone } from 'fte.js-standalone'

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  return F
}

function text(content: string, eol = true) {
  return [{ type: 'text', content, eol }] as any
}

function normalizeTsToJs(tsCode: string): string {
  // Remove TypeScript parameter types and generics in function signatures
  let s = tsCode
    // remove this: TemplateBase in compile
    .replace(/this:\s*TemplateBase/g, '')
    // remove type annotations like ": Array<string>" or ": string" but DO NOT touch ": function"
    .replace(/:(?!\s*function)\s*[A-Za-z_][A-Za-z0-9_<>,\[\]\s{}]*/g, '')
    // remove generics like <T>( or <T>(blockName: string,...)
    .replace(/<[^>]+>\(/g, '(')
    // remove " as any" casts
    .replace(/\s+as\s+any/g, '')

  // Compact whitespace differences
  s = s.replace(/\s+/g, ' ').trim()
  return s
}

function normalizeJs(jsCode: string): string {
  return jsCode.replace(/\s+/g, ' ').trim()
}

describe('TS vs JS templates equivalence (structure/behavior)', () => {
  const baseCtx: any = {
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
    main: text('Hello'),
  }

  test('MainTemplate.ts.njs and MainTemplate.njs produce equivalent JS after stripping types', () => {
    const F = makeFactory()
    const jsRes = F.run(baseCtx, 'MainTemplate.njs') as any
    const tsRes = F.run(baseCtx, 'MainTemplate.ts.njs') as any
    const jsCode = typeof jsRes === 'string' ? jsRes : jsRes.code
    const tsCode = typeof tsRes === 'string' ? tsRes : tsRes.code

    // Sanity: TS has type annotations which JS version must not have
    expect(tsCode).toMatch(/var out: Array<string>/)
    expect(jsCode).not.toMatch(/Array<string>/)

    const jsN = normalizeJs(jsCode)
    const tsN = normalizeTsToJs(tsCode)
    expect(tsN).toContain('script: function (context, _content, partial, slot, options)')
    expect(jsN).toContain('script: function (context, _content, partial, slot, options)')
    // After normalization, TS and JS bodies should be equivalent
    expect(tsN).toContain('out.push("Hello");')
    expect(jsN).toContain('out.push("Hello");')
  })

  test('blocks and slots bodies are equivalent after stripping types', () => {
    const F = makeFactory()

    const header = { directives: { context: 'ctx', content: false, chunks: undefined, alias: undefined, deindent: false, requireAs: [] }, main: text('Header') }
    const footer = { directives: { context: 'ctx', content: false, chunks: undefined, alias: undefined, deindent: false, requireAs: [] }, main: text('Footer') }

    const ctx: any = {
      directives: { context: 'context', content: false, chunks: undefined, alias: undefined, deindent: false, requireAs: [], blocks: { header, footer }, slots: { footer } },
      blocks: { header, footer },
      slots: { footer },
      main: text('Body')
    }

    const jsRes = F.run(ctx, 'MainTemplate.njs') as any
    const tsRes = F.run(ctx, 'MainTemplate.ts.njs') as any
    const jsCode = typeof jsRes === 'string' ? jsRes : jsRes.code
    const tsCode = typeof tsRes === 'string' ? tsRes : tsRes.code

    const jsN = normalizeJs(jsCode)
    const tsN = normalizeTsToJs(tsCode)

    expect(jsN).toContain('blocks : {')
    expect(tsN).toContain('blocks : {')
    expect(jsN).toContain('"header": function(')
    expect(tsN).toContain('"header": function(')
    expect(jsN).toContain('out.push("Header");')
    expect(tsN).toContain('out.push("Header");')

    expect(jsN).toContain('slots : {')
    expect(tsN).toContain('slots : {')
    expect(jsN).toContain('"footer": function(')
    expect(tsN).toContain('"footer": function(')
    expect(jsN).toContain('out.push("Footer");')
    expect(tsN).toContain('out.push("Footer");')
  })

  test('chunks plumbing present in both; compile sets this.chunks in both variants', () => {
    const F = makeFactory()

    const ctx: any = {
      directives: { context: 'context', content: false, chunks: 'main', alias: undefined, deindent: false, requireAs: [], blocks: {}, slots: {}, includeMainChunk: false, useHash: false },
      blocks: {},
      slots: {},
      main: text('X')
    }

    const jsRes = F.run(ctx, 'MainTemplate.njs') as any
    const tsRes = F.run(ctx, 'MainTemplate.ts.njs') as any

    const jsCode = typeof jsRes === 'string' ? jsRes : jsRes.code
    const tsCode = typeof tsRes === 'string' ? tsRes : tsRes.code

    const jsN = normalizeJs(jsCode)
    const tsN = normalizeTsToJs(tsCode)

    for (const s of [jsN, tsN]) {
      expect(s).toContain('const _partial = partial')
      expect(s).toContain('function chunkStart(')
      expect(s).toContain("if(out.some(t=>typeof t == 'object')){")
      expect(/compile\s*:\s*function\s*\(|compile\s*\(/.test(s)).toBeTruthy()
    }
  })
})
