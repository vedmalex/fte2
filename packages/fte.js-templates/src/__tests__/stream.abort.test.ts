import templates from '../index'
import { TemplateFactoryStandalone } from 'fte.js-standalone'

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  F.options = { ...(F.options as any), stream: true } as any
  return F
}

describe('stream abort', () => {
  test('non-chunk template stops on abort (no eval)', async () => {
    const Local = new TemplateFactoryStandalone({
      'x.njs': {
        name: 'x.njs',
        script: function (_ctx: any, _c: any, _p: any, _s: any, options: any) {
          const ab = options && options.abort
          const gen = async function* () {
            for (let i = 0; i < 50; i++) {
              if (ab && ab.aborted) return
              yield `T${i}-`
            }
            if (ab && ab.aborted) return
            yield 'END'
          }
          return gen()
        },
        blocks: {},
        slots: {},
        compile() {},
        dependency: {}
      } as any
    } as any)
    const abort = { aborted: false }
    Local.options = { ...(Local.options as any), stream: true, abort } as any
    const it = (Local as any).runStream({}, 'x.njs') as AsyncIterable<string>
    let collected = ''
    for await (const c of it) {
      collected += c
      abort.aborted = true
      break
    }
    expect(collected.length).toBeGreaterThan(0)
    expect(collected.includes('END')).toBe(false)
  })
})
