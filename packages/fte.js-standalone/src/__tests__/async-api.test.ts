import { describe, expect, test } from 'vitest'
import templates from 'fte.js-templates'
import { TemplateFactoryStandalone } from '../TemplateFactoryStandalone'

function text(content: string, eol = true) {
  return [{ type: 'text', content, eol }] as any
}

describe('Async factory APIs', () => {
  test('runAsync returns same result as run for sync templates', async () => {
    const F = new TemplateFactoryStandalone(templates as any)
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
      main: text('Hello'),
    }
    const syncRes: any = F.run(ctx, 'MainTemplate.njs')
    const asyncRes: any = await F.runAsync(ctx, 'MainTemplate.njs')
    const syncStr = typeof syncRes === 'string' ? syncRes : syncRes.code
    const asyncStr = typeof asyncRes === 'string' ? asyncRes : asyncRes.code
    expect(asyncStr).toBe(syncStr)
  })

  test('runPartialAsync returns same result as runPartial for sync templates', async () => {
    const F = new TemplateFactoryStandalone(templates as any)
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
      main: text('Hello'),
    }
    const res = F.run(ctx, 'MainTemplate.njs') as any
    const cfg =
      typeof res === 'string'
        ? eval('(' + res + ')')
        : eval('(' + res.code + ')')
    const Local = new TemplateFactoryStandalone({ 'x.njs': cfg } as any)
    const s1 = Local.runPartial({ context: {}, name: 'x.njs' })
    const s2 = await Local.runPartialAsync({ context: {}, name: 'x.njs' })
    expect(s2).toBe(s1)
  })
})
