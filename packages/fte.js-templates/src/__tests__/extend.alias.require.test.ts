import templates from '../index'
import { TemplateFactoryStandalone } from 'fte.js-standalone'

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  return F
}

function text(content: string, eol = true) {
  return [{ type: 'text', content, eol }] as any
}

describe('extend/alias/requireAs integration', () => {
  test('extend merges parent blocks and aliases; requireAs wires dependencies', () => {
    const F = makeFactory()

    // Parent template provides block and alias
    const parent: any = {
      directives: {
        context: 'context',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [{ name: 'codeblock.njs', alias: 'code' }],
        blocks: {},
        slots: {},
        extend: undefined,
      },
      blocks: {
        main: {
          directives: { context: 'context', content: false, chunks: undefined },
          main: text('PARENT')
        }
      },
      slots: {},
      main: text('P:'),
      alias: 'parent.njs',
    }

    const child: any = {
      directives: {
        context: 'context',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
        blocks: {},
        slots: {},
        extend: 'parent.njs',
      },
      blocks: {
        main: {
          directives: { context: 'context', content: false, chunks: undefined },
          main: text('CHILD')
        }
      },
      slots: {},
      main: text('C:'),
      alias: 'child.njs',
    }

    // Register parent and child into factory by compiling core
    const P: any = F.run(parent, 'MainTemplate.njs') as any
    const C: any = F.run(child, 'MainTemplate.njs') as any

    const tpls: any = {
      'parent.njs': P,
      'child.njs': C,
    }

    const Local = new TemplateFactoryStandalone(tpls)
    // parent must be ensured on compile(); child extends parent and merges
    const html = Local.run({}, 'child.njs') as string
    expect(html).toContain('P:')
    expect(html).toContain('C:')
  })
})
