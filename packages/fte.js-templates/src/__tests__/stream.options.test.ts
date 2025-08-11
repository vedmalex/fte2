import { TemplateFactoryStandalone } from 'fte.js-standalone'

describe('stream options', () => {
  test('onChunk callback is invoked on each yielded piece', async () => {
    const Local = new TemplateFactoryStandalone({
      'x.njs': {
        name: 'x.njs',
        script: function (_ctx: any, _c: any, _p: any, _s: any, options: any) {
          if (options && options.stream) {
            const gen = async function* () { yield 'A'; yield 'B'; yield 'C' }
            return gen()
          }
          return 'ABC'
        },
        blocks: {},
        slots: {},
        compile() {},
        dependency: {}
      } as any
    } as any)
    const seen: string[] = []
    Local.options = { ...(Local.options as any), stream: true, onChunk: (c: string) => seen.push(c) } as any
    const it = (Local as any).runStream({}, 'x.njs') as AsyncIterable<string>
    const acc: string[] = []
    for await (const c of it) acc.push(c)
    expect(acc.join('')).toBe('ABC')
    expect(seen.join('')).toBe('ABC')
  })
})
