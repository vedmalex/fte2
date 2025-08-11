import { TemplateFactoryStandalone } from 'fte.js-standalone'

describe('stream deindent', () => {
  test('non-chunk: trims common indent per line while streaming', async () => {
    const Local = new TemplateFactoryStandalone({
      'x.njs': {
        name: 'x.njs',
        script: function (_ctx: any, _c: any, _p: any, _s: any, options: any) {
          if (options && options.stream) {
            const gen = async function* () {
              yield '    foo\n'
              yield '    bar\n'
              yield '      baz'
            }
            return gen()
          }
          return '    foo\n    bar\n      baz'
        },
        blocks: {},
        slots: {},
        compile() {},
        dependency: {}
      } as any
    } as any)
    Local.options = { ...(Local.options as any), stream: true, deindent: true } as any
    const it = (Local as any).runStream({}, 'x.njs') as AsyncIterable<string>
    const chunks: string[] = []
    for await (const c of it) chunks.push(c)
    expect(chunks.join('')).toBe('foo\nbar\n  baz')
  })

  test('chunks: trims indent inside AsyncIterable content', async () => {
    const Local = new TemplateFactoryStandalone({
      'x.njs': {
        name: 'x.njs',
        chunks: 'main',
        script: function (_ctx: any, _c: any, _p: any, _s: any, _options: any) {
          const main = { name: 'main', content: [] as any[] }
          main.content.push('    A\n')
          main.content.push('      B\n')
          main.content.push('    C')
          return [main]
        },
        blocks: {},
        slots: {},
        compile() {},
        dependency: {}
      } as any
    } as any)
    Local.options = { ...(Local.options as any), stream: true, deindent: true } as any
    const res = (Local as any).runStream({}, 'x.njs') as Array<{ name: string; content: AsyncIterable<string> }>
    const chunks: string[] = []
    for await (const c of res[0].content) chunks.push(c)
    expect(chunks.join('')).toBe('A\n  B\nC')
  })
})
