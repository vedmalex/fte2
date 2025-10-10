import { describe, expect, test } from 'vitest'
import { TemplateFactoryStandalone } from 'fte.js-standalone'
import templates from '../index'

function makeFactory() {
  const F = new TemplateFactoryStandalone(templates as any)
  // enable promise mode in compiler output
  F.options = { ...(F.options as any), promise: true } as any
  return F
}

function runGenerated(code: string, options: any, vars: Record<string, any>) {
  const fn = new Function(
    'options',
    ...Object.keys(vars),
    `var out=[];\n${code};\nreturn out`,
  )
  return fn(options, ...Object.values(vars))
}

describe('async expressions/uexpressions in codeblock', () => {
  test('expression returns Promise resolved and joined', async () => {
    const F = makeFactory()
    const blocks = [
      { type: 'text', content: 'A', eol: false },
      {
        type: 'expression',
        content: 'promiseName',
        start: true,
        end: true,
        eol: false,
      },
      { type: 'text', content: 'Z', eol: true },
    ] as any

    const res: any = F.run(blocks, 'codeblock.njs')
    const out = runGenerated(
      res.code,
      {
        escapeIt: (s: string) => s,
        applyIndent: (s: string) => s,
        applyDeindent: (s: string) => s,
      },
      {
        promiseName: Promise.resolve('X'),
      },
    )

    const final = (
      await Promise.all(
        out.map((v: any) =>
          v && typeof v.then === 'function' ? v : Promise.resolve(v),
        ),
      )
    ).join('')
    expect(final).toBe('AXZ')
  })

  test('uexpression returns Promise and goes through escape/indent', async () => {
    const F = makeFactory()
    const blocks = [
      { type: 'text', content: 'Hi ', eol: false },
      {
        type: 'uexpression',
        content: 'promiseName',
        start: true,
        end: true,
        eol: true,
        indent: '  ',
      },
    ] as any

    const res: any = F.run(blocks, 'codeblock.njs')
    const out = runGenerated(
      res.code,
      {
        escapeIt: (s: string) => `[${s}]`,
        applyIndent: (s: string, i: string) => i + s,
        applyDeindent: (s: string) => s,
      },
      {
        promiseName: Promise.resolve('name'),
      },
    )

    const final = (
      await Promise.all(
        out.map((v: any) =>
          v && typeof v.then === 'function' ? v : Promise.resolve(v),
        ),
      )
    ).join('')
    expect(final).toBe('Hi   [name]')
  })
})
