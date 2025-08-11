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
  test('returns async iterable for non-chunk template (no eval)', async () => {
    const Local = new TemplateFactoryStandalone({
      'x.njs': {
        name: 'x.njs',
        script: function (context: any, _c: any, _p: any, _s: any, options: any) {
          if (options && options.stream) {
            const ab = options.abort
            const gen = async function* () {
              if (ab && ab.aborted) return
              yield 'A'
              const v = await Promise.resolve(context.x)
              if (ab && ab.aborted) return
              yield String(v)
              if (ab && ab.aborted) return
              yield 'Z'
            }
            return gen()
          }
          return 'A' + String(context.x) + 'Z'
        },
        blocks: {},
        slots: {},
        compile() {},
        dependency: {}
      } as any
    } as any)
    Local.options = { ...(Local.options as any), stream: true } as any
    const it = (Local as any).runStream({ x: Promise.resolve('X') } as any, 'x.njs') as AsyncIterable<string>
    const chunks: string[] = []
    for await (const c of it) chunks.push(c)
    expect(chunks.join('')).toBe('AXZ')
  })
})
