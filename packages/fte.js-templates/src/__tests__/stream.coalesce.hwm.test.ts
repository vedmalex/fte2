import { TemplateFactoryStandalone } from 'fte.js-standalone'

describe('stream coalescing and highWaterMark', () => {
  test('coalesces small chunks up to maxCoalesceChunkSize in chunked templates', async () => {
    const Local = new TemplateFactoryStandalone({
      'x.njs': {
        name: 'x.njs', chunks: 'main',
        script: function (_ctx: any, _c: any, _p: any, _s: any, _options: any) {
          const main = { name: 'main', content: [] as any[] }
          for (let i = 0; i < 10; i++) main.content.push('a')
          return [main]
        },
        blocks: {}, slots: {}, compile() {}, dependency: {}
      } as any
    } as any)
    Local.options = { ...(Local.options as any), stream: true, maxCoalesceChunkSize: 5 } as any
    const res = (Local as any).runStream({}, 'x.njs') as Array<{ name: string; content: AsyncIterable<string> }>
    const seen: string[] = []
    for await (const c of res[0].content) seen.push(c)
    expect(seen.join('')).toBe('aaaaaaaaaa')
    expect(seen.every(s => s.length <= 5)).toBe(true)
  })
})
