import { TemplateFactoryStandalone } from 'fte.js-standalone'

describe('highWaterMark soft backpressure (behavioral)', () => {
  test('yields all pieces with onChunk capture', async () => {
    const Local = new TemplateFactoryStandalone({
      'x.njs': {
        name: 'x.njs',
        script: function (_ctx: any, _c: any, _p: any, _s: any, options: any) {
          if (options && options.stream) {
            const gen = async function* () {
              for (let i = 0; i < 50; i++) yield 'a'
            }
            return gen()
          }
          return 'a'.repeat(50)
        },
        blocks: {}, slots: {}, compile() {}, dependency: {}
      } as any
    } as any)
    const seen: string[] = []
    Local.options = { ...(Local.options as any), stream: true, highWaterMark: 5, onChunk: (c: string) => seen.push(c) } as any
    const it = (Local as any).runStream({}, 'x.njs') as AsyncIterable<string>
    const acc: string[] = []
    for await (const c of it) acc.push(c)
    expect(acc.join('')).toBe('a'.repeat(50))
    expect(seen.join('')).toBe('a'.repeat(50))
  })
})
