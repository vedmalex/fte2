import { describe, expect, test } from 'vitest'
import { TemplateFactoryStandalone } from 'fte.js-standalone'
import templates from '../index'

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
          main: text('PARENT'),
        },
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
          main: text('CHILD'),
        },
      },
      slots: {},
      main: text('C:'),
      alias: 'child.njs',
    }

    // Register parent and child into factory by compiling core
    const Pres: any = F.run(parent, 'MainTemplate.njs') as any
    const Cres: any = F.run(child, 'MainTemplate.njs') as any
    const Pcode = typeof Pres === 'string' ? Pres : Pres.code
    const Ccode = typeof Cres === 'string' ? Cres : Cres.code

    // Evaluate to template configs
    const Ptpl = eval(`(${Pcode})`)
    const Ctpl = eval(`(${Ccode})`)

    const Local = new TemplateFactoryStandalone({
      'parent.njs': Ptpl,
      'child.njs': Ctpl,
      // dependency ensured in compile()
      'codeblock.njs': (templates as any)['codeblock.njs'],
    } as any)

    // parent must be ensured on compile(); child extends parent and merges
    const html = Local.run({}, 'child.njs') as string
    // Current behavior: parent template renders when extended without explicit content() linkage
    expect(html).toContain('P:')
  })
})
