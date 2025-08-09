import { TemplateFactoryBrowser } from '../TemplateFactoryBrowser'
import { DefaultFactoryOption } from 'fte.js-base'

describe('TemplateFactoryBrowser', () => {
  test('loads template via global.fte and runs it', () => {
    const called: string[] = []
    ;(globalThis as any).fte = <O extends DefaultFactoryOption>(filename: string) => {
      called.push(filename)
      return {
        name: filename,
        source: '',
        absPath: filename,
        alias: [filename],
        aliases: {},
        dependency: {},
        script: function (context: any, _content: any, _partial: any, _slot: any, _options: any) {
          const out: string[] = []
          out.push('OK')
          return out.join('')
        },
      }
    }

    const F = new TemplateFactoryBrowser()
    const res = F.run({}, 'foo.njs') as string
    expect(res).toBe('OK')
    expect(called).toEqual(['foo.njs'])
  })

  test('runPartial returns string and rejects chunks templates', () => {
    const called: string[] = []
    ;(globalThis as any).fte = <O extends DefaultFactoryOption>(filename: string) => {
      called.push(filename)
      return {
        name: filename,
        source: '',
        absPath: filename,
        alias: [filename],
        aliases: {},
        dependency: {},
        chunks: '',
        script: function (_context: any) {
          return 'S'
        },
      }
    }

    const F = new TemplateFactoryBrowser()
    const s = F.runPartial({ context: {}, name: 'bar.njs' })
    expect(typeof s).toBe('string')

    ;(globalThis as any).fte = <O extends DefaultFactoryOption>(filename: string) => {
      return {
        name: filename,
        source: '',
        absPath: filename,
        alias: [filename],
        aliases: {},
        dependency: {},
        script: function (_context: any) {
          return 'S'
        },
        compile: function (this: any) {
          // Mark instance as chunks-enabled so runPartial rejects
          this.chunks = 'main'
        },
      }
    }
    const G = new TemplateFactoryBrowser()
    expect(() => G.runPartial({ context: {}, name: 'bar.njs' })).toThrow("cant't use template with chunks as partial")
  })
})
