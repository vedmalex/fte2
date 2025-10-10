import { describe, expect, test } from 'vitest'
import { TemplateFactoryStandalone } from 'fte.js-standalone'
import templates from '../index'

type BlockItem = {
  type: 'text' | 'expression' | 'uexpression' | 'code'
  content: string
  eol: boolean
  start?: boolean
  end?: boolean
  indent?: string
  sourceFile?: string
  originalStart?: { line: number; column: number; source: string }
  sourceContent?: string
}

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  F.options = {
    ...F.options,
    sourceMap: true,
    inline: false,
    sourceFile: 'gen.js',
    sourceRoot: '/root',
  } as any
  return F
}

function mk(
  type: BlockItem['type'],
  content: string,
  pos: { line: number; column: number },
  extras?: Partial<BlockItem>,
): BlockItem {
  return {
    type,
    content,
    eol: extras?.eol ?? true,
    start: extras?.start,
    end: extras?.end,
    indent: extras?.indent,
    sourceFile: 'template.njs',
    originalStart: {
      line: pos.line,
      column: pos.column,
      source: 'template.njs',
    },
    sourceContent: extras?.sourceContent ?? undefined,
  }
}

describe('Source maps positions', () => {
  test('codeblock maps original positions for text/expression/uexpression/code', () => {
    const F = makeFactory()
    const blocks = [
      mk('text', 'Hello ', { line: 1, column: 1 }, { eol: false }),
      mk(
        'uexpression',
        ' name ',
        { line: 1, column: 7 },
        { start: true, end: true, eol: true },
      ),
      mk('code', 'const x=1;', { line: 2, column: 1 }, { eol: true }),
      mk(
        'expression',
        'a+b',
        { line: 3, column: 3 },
        { start: true, end: true, eol: true },
      ),
    ] as any

    const res: any = F.run(blocks, 'codeblock.njs')
    expect(typeof res).toBe('object')
    expect(res.map).toBeDefined()

    const segments = (res.map?.template?.segments || []) as Array<any>
    // There should be at least one mapping per block
    expect(segments.length).toBeGreaterThanOrEqual(4)

    // Validate presence of segments for the 4 blocks
    const byName = (n: string) => segments.find((s) => s.name === n)
    expect(byName('text')).toMatchObject({
      source: 'template.njs',
      originalLine: 1,
      originalColumn: 1,
    })
    expect(byName('uexpression')).toMatchObject({
      source: 'template.njs',
      originalLine: 1,
      originalColumn: 7,
    })
    expect(byName('code')).toMatchObject({
      source: 'template.njs',
      originalLine: 2,
      originalColumn: 1,
    })
    expect(byName('expression')).toMatchObject({
      source: 'template.njs',
      originalLine: 3,
      originalColumn: 3,
    })
  })

  test('nested blocks and slots produce correct original mappings', () => {
    const F = makeFactory()

    // Define a simple block and slot
    const footer = {
      directives: {
        context: 'ctx',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
      },
      main: [mk('text', 'Footer', { line: 10, column: 1 })],
    }
    const aside = {
      directives: {
        context: 'a',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
      },
      main: [
        mk(
          'uexpression',
          'nested',
          { line: 20, column: 3 },
          { start: true, end: true, indent: '  ' },
        ),
      ],
    }

    const ctx: any = {
      directives: {
        context: 'context',
        content: false,
        chunks: undefined,
        alias: undefined,
        deindent: false,
        requireAs: [],
        blocks: { footer },
        slots: { aside },
      },
      blocks: { footer },
      slots: { aside },
      main: [
        mk('text', 'Body', { line: 1, column: 1 }),
        mk('code', 'let a=1;', { line: 2, column: 1 }),
      ],
    }

    // Main template map
    const res: any = F.run(ctx, 'MainTemplate.njs')
    expect(res.map).toBeDefined()
    const mainSeg = res.map?.template?.segments || []
    expect(mainSeg.length).toBeGreaterThan(0)
    const firstNamed = mainSeg.find((s: any) => s && s.name)
    expect(firstNamed).toMatchObject({
      name: 'text',
      source: 'template.njs',
      originalLine: 1,
      originalColumn: 1,
    })

    // Block map
    const blockRes: any = F.run(footer.main as any, 'codeblock.njs')
    expect(blockRes.map?.template?.segments?.[0]).toMatchObject({
      name: 'text',
      originalLine: 10,
      originalColumn: 1,
    })

    // Slot map
    const slotRes: any = F.run(aside.main as any, 'codeblock.njs')
    expect(slotRes.map?.template?.segments?.[0]).toMatchObject({
      name: 'uexpression',
      originalLine: 20,
      originalColumn: 3,
    })
  })

  test('chunked outputs preserve map integrity for main content', () => {
    const F = makeFactory()

    const ctx: any = {
      directives: {
        context: 'ctx',
        content: false,
        chunks: 'main',
        alias: undefined,
        deindent: false,
        requireAs: [],
        includeMainChunk: true,
        useHash: false,
      },
      blocks: {},
      slots: {},
      main: [
        mk('text', 'Hello ', { line: 1, column: 1 }, { eol: false }),
        mk(
          'expression',
          'name',
          { line: 1, column: 7 },
          { start: true, end: true, eol: true },
        ),
      ],
    }

    const res: any = F.run(ctx, 'MainTemplate.njs')
    expect(res.map).toBeDefined()
    const segments = res.map?.template?.segments || []
    expect(segments.length).toBeGreaterThanOrEqual(2)
    const textSeg = (segments as any[]).find((s) => s.name === 'text')
    const exprSeg = (segments as any[]).find((s) => s.name === 'expression')
    expect(textSeg).toMatchObject({ originalLine: 1, originalColumn: 1 })
    expect(exprSeg).toMatchObject({ originalLine: 1, originalColumn: 7 })
  })
})
