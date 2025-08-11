import templates from '../index'
import { TemplateFactoryStandalone } from 'fte.js-standalone'

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  F.options = { ...(F.options as any), stream: true } as any
  return F
}

describe('stream abort', () => {
  test.skip('non-chunk template stops on abort', async () => {
    const F = makeFactory()

    const blocks = [] as any[]
    // Build many small pushes to ensure multiple yielded chunks
    for (let i = 0; i < 50; i++) {
      blocks.push({ type: 'text', content: `T${i}-`, eol: false })
    }
    blocks.push({ type: 'text', content: 'END', eol: true })

    const tpl: any = {
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
      main: blocks,
    }

    const res: any = F.run(tpl, 'MainTemplate.njs')
    const code = typeof res === 'string' ? res : res.code
    const cfg = eval('(' + code + ')')

    const Local = new TemplateFactoryStandalone({ 'x.njs': cfg } as any)
    const abort = { aborted: false }
    Local.options = { ...(Local.options as any), stream: true, abort } as any

    const it = (Local as any).runStream({}, 'x.njs') as AsyncIterable<string>

    let collected = ''
    for await (const c of it) {
      collected += c
      // Abort after first chunk to ensure early stop
      abort.aborted = true
      break
    }

    expect(collected.length).toBeGreaterThan(0)
    // Should not consume entire string due to abort
    expect(collected.includes('END')).toBe(false)
  })
})
