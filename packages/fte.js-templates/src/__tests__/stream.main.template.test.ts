import templates from '../index'
import { TemplateFactoryStandalone } from 'fte.js-standalone'

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  F.options = { ...(F.options as any), stream: true } as any
  return F
}

function text(content: string, eol = true) {
  return [{ type: 'text', content, eol }] as any
}

describe('MainTemplate.njs stream mode', () => {
  test.skip('returns async iterable for non-chunk template', async () => {
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
      main: [
        { type: 'text', content: 'A', eol: false },
        { type: 'expression', content: 'context.x', start: true, end: true, eol: false },
        { type: 'text', content: 'Z', eol: true },
      ] as any,
    }

    const res: any = F.run(ctx, 'MainTemplate.njs')
    const code = typeof res === 'string' ? res : res.code
    const cfg = eval('(' + code + ')')

    const Local = new TemplateFactoryStandalone({ 'x.njs': cfg } as any)
    Local.options = { ...(Local.options as any), stream: true } as any

    const it = (Local as any).runStream({ x: Promise.resolve('X') } as any, 'x.njs') as AsyncIterable<string>

    const chunks: string[] = []
    for await (const c of it) chunks.push(c)
    expect(chunks.join('')).toBe('AXZ')
  })
})
