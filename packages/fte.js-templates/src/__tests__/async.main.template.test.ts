import templates from '../index'
import { TemplateFactoryStandalone } from 'fte.js-standalone'

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  F.options = { ...(F.options as any), promise: true } as any
  return F
}

function text(content: string, eol = true) {
  return [{ type: 'text', content, eol }] as any
}

describe('MainTemplate.njs async mode', () => {
  test('awaits promise expressions and joins with __aj', async () => {
    const F = makeFactory()

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
      main: [
        { type: 'text', content: 'A', eol: false },
        { type: 'expression', content: 'context.promiseName', start: true, end: true, eol: false },
        { type: 'text', content: 'Z', eol: true },
      ] as any,
    }

    const res: any = F.run(ctx, 'MainTemplate.njs')
    const cfg = typeof res === 'string' ? eval('(' + res + ')') : eval('(' + res.code + ')')

    const Local = new TemplateFactoryStandalone({ 'x.njs': cfg } as any)
    Local.options = { ...(Local.options as any), promise: true } as any

    const html = await Local.runAsync({ promiseName: Promise.resolve('X') } as any, 'x.njs')
    expect(typeof html).toBe('string')
    expect(html).toBe('AXZ')
  })

  test('partials that return Promise are awaited', async () => {
    const F = makeFactory()

    const part: any = {
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
      main: [
        { type: 'text', content: 'P', eol: false },
        { type: 'expression', content: 'Promise.resolve("Q")', start: true, end: true, eol: false },
      ] as any,
    }

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
      main: [
        { type: 'expression', content: "partial(context, 'part.njs')", start: true, end: true, eol: true },
      ] as any,
    }

    const corePart: any = F.run(part, 'MainTemplate.njs')
    const coreMain: any = F.run(ctx, 'MainTemplate.njs')

    const cfgPart = typeof corePart === 'string' ? eval('(' + corePart + ')') : eval('(' + corePart.code + ')')
    const cfgMain = typeof coreMain === 'string' ? eval('(' + coreMain + ')') : eval('(' + coreMain.code + ')')

    const Local = new TemplateFactoryStandalone({ 'main.njs': cfgMain, 'part.njs': cfgPart } as any)
    Local.options = { ...(Local.options as any), promise: true } as any

    const html = await Local.runAsync({} as any, 'main.njs')
    expect(typeof html).toBe('string')
    expect(html).toBe('PQ')
  })

  test('slots with Promise content are joined', async () => {
    const F = makeFactory()

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
      main: [
        { type: 'text', content: 'S', eol: false },
        { type: 'expression', content: "slot('a', [Promise.resolve('L')])", start: true, end: true, eol: false },
      ] as any,
    }

    const res: any = F.run(ctx, 'MainTemplate.njs')
    const cfg = typeof res === 'string' ? eval('(' + res + ')') : eval('(' + res.code + ')')

    const Local = new TemplateFactoryStandalone({ 'x.njs': cfg } as any)
    Local.options = { ...(Local.options as any), promise: true } as any

    const html = await Local.runAsync({} as any, 'x.njs')
    expect(typeof html).toBe('string')
    expect(html).toBe('S')
  })
})
