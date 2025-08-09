import { TemplateFactoryStandalone } from '../TemplateFactoryStandalone'
import templates from 'fte.js-templates'

function textBlock(content: string, withEol = true) {
  return [{ type: 'text', content, eol: withEol }] as any
}

describe('TemplateFactoryStandalone', () => {
  test('preloads templates and runs MainTemplate.njs', () => {
    const F = new TemplateFactoryStandalone(templates as any)
    const ctx: any = {
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
      main: textBlock('Hello'),
    }
    const res: any = F.run(ctx, 'MainTemplate.njs')
    expect(typeof res).toBe('object')
    expect(res.code || res).toBeTruthy()
  })

  test('throws when template not found', () => {
    const F = new TemplateFactoryStandalone(templates as any)
    expect(() => F.run({}, 'missing.njs' as any)).toThrow('template missing.njs not found')
  })

  test('runPartial throws for templates with chunks', () => {
    const F = new TemplateFactoryStandalone(templates as any)
    const templName = 'MainTemplate.njs'
    // Ensure template is loaded, then mark it as chunks-enabled
    const tmpl: any = (F as any).ensure(templName)
    tmpl.chunks = 'main'
    expect(() => F.runPartial({ context: {}, name: templName })).toThrow("cant't use template with chunks as partial")
  })
})
