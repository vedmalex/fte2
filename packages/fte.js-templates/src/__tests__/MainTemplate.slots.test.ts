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

describe('MainTemplate.njs - slots generation', () => {
  test('includes slots section when slots are defined', () => {
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

    const res: any = F.run(ctx, 'MainTemplate.njs')
    expect(typeof res).toBe('object')
    expect(res.code).toContain('slots : {')
    expect(res.code).toContain('"footer": function(')
    expect(res.code).toContain('out.push("Footer");')
  })

  test('slot function emits chunk plumbing when top-level chunks is set', () => {
    const F = makeFactory()

    const aside = {
      directives: {
        context: 'a',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
      },
      main: textBlock('A'),
    }

    const ctx: any = {
      directives: {
        context: 'context',
        content: false,
        chunks: 'main',
        alias: undefined,
        deindent: false,
        requireAs: [],
        blocks: { aside },
        slots: { aside },
        includeMainChunk: false,
        useHash: false,
      },
      blocks: { aside },
      slots: { aside },
      main: textBlock('Body'),
    }

    const res: any = F.run(ctx, 'MainTemplate.njs')
    expect(res.code).toContain('slots : {')
    expect(res.code).toContain('"aside": function(')
    expect(res.code).toContain("if(out.some(t=>typeof t == 'object')){")
  })
})
