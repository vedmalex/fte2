import { describe, expect, it } from 'vitest'
import { TemplateFactoryBase } from '../../../fte.js-base/src/TemplateFactoryBase'
import { TemplateBase } from '../../../fte.js-base/src/TemplateBase'
import type { DefaultFactoryOption } from '../../../fte.js-base/src/types/DefaultFactoryOption'
import type { TemplateConfig } from '../../../fte.js-base/src/types/TemplateConfig'
import type { RunPartialContext } from '../../../fte.js-base/src/types/RunPartialContext'

class TestTemplate<
  OPTIONS extends DefaultFactoryOption,
> extends TemplateBase<OPTIONS> {
  public override compile() {
    if (this.parent) {
      this.mergeParent(this.factory.ensure(this.parent))
    }
  }
}

class TestFactory extends TemplateFactoryBase<DefaultFactoryOption> {
  constructor(
    private readonly templates: Record<string, TemplateConfig>,
  ) {
    super()
  }

  public resolveTemplateConfig(
    fileName: string,
  ): TemplateConfig<DefaultFactoryOption> {
    const source = this.templates[fileName]
    if (!source) {
      throw new Error(`Template ${fileName} not found`)
    }
    const clone: TemplateConfig<DefaultFactoryOption> = {
      ...source,
      blocks: source.blocks ? { ...source.blocks } : undefined,
      slots: source.slots ? { ...source.slots } : undefined,
      aliases: source.aliases ? { ...source.aliases } : undefined,
      alias: source.alias ? [...source.alias] : undefined,
      dependency: source.dependency ? { ...source.dependency } : undefined,
      script: source.script,
      compile: source.compile,
      source: source.source,
      srcCode: source.srcCode,
    }
    clone.name = clone.name ?? fileName
    clone.factory = this
    return clone
  }

  public override load(fileName: string) {
    const config = this.resolveTemplateConfig(fileName)
    const templ = new TestTemplate(config)
    this.register(templ, fileName)
    templ.compile()
    return templ
  }

  public override run<T>(
    context: T,
    name: string,
  ): string | Array<{ name: string; content: string }> {
    const templ = this.ensure(name)
    const bc = this.blockContent(templ)
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options)
  }

  public override runPartial<T>({
    context,
    name,
    options,
    slots,
  }: RunPartialContext<T, DefaultFactoryOption>): string {
    const templ = this.ensure(name)
    if (templ.chunks) {
      throw new Error(`can't use chunked template as partial: ${name}`)
    }
    const wantsSourceMap =
      options && Object.prototype.hasOwnProperty.call(options, 'sourceMap')
        ? Boolean(options.sourceMap)
        : false
    const invocationOptions = {
      ...this.options,
      ...(options ?? {}),
    } as DefaultFactoryOption
    if (!wantsSourceMap) {
      invocationOptions.sourceMap = false
    }
    const previous = this.options
    this.options = invocationOptions
    try {
      const bc = this.blockContent(templ, slots)
      const result = bc.run(
        context,
        bc.content,
        bc.partial,
        bc.slot,
        invocationOptions,
      ) as string | { code: string }
      if (!wantsSourceMap && result && typeof result === 'object') {
        if ('code' in result) {
          return result.code
        }
      }
      return result as string
    } finally {
      this.options = previous
    }
  }

  public async runPartialAsync<T>({
    context,
    name,
    options,
    slots,
  }: RunPartialContext<T, DefaultFactoryOption>): Promise<string> {
    const templ = this.ensure(name)
    if (templ.chunks) {
      throw new Error(`can't use chunked template as partial: ${name}`)
    }
    const wantsSourceMap =
      options && Object.prototype.hasOwnProperty.call(options, 'sourceMap')
        ? Boolean(options.sourceMap)
        : false
    const invocationOptions = {
      ...this.options,
      ...(options ?? {}),
    } as DefaultFactoryOption
    if (!wantsSourceMap) {
      invocationOptions.sourceMap = false
    }
    const previous = this.options
    this.options = invocationOptions
    try {
      const bc: any = this.blockContent(templ, slots)
      const result =
        typeof bc.runAsync === 'function'
          ? await bc.runAsync(
              context,
              bc.content,
              bc.partial,
              bc.slot,
              invocationOptions,
            )
          : bc.run(context, bc.content, bc.partial, bc.slot, invocationOptions)
      if (!wantsSourceMap && result && typeof result === 'object') {
        if ('code' in result) {
          return result.code
        }
      }
      return result as string
    } finally {
      this.options = previous
    }
  }
}

const BASE_CODE = 'partial-output'

const createTemplates = (calls: Array<any>) => {
  const partialTemplate: TemplateConfig = {
    name: 'partial.njs',
    alias: ['partial.njs'],
    script: (_ctx, _content, _partial, _slot, options) => {
      calls.push({
        template: 'partial.njs',
        sourceMap: options?.sourceMap ?? false,
        sourceFile: options?.sourceFile,
      })
      if (options?.sourceMap) {
        return {
          code: BASE_CODE,
          map: {
            version: 3,
            file: options.sourceFile ?? 'partial-output.js',
            sourceRoot: options.sourceRoot ?? null,
            sources: ['partial.njs'],
            names: [],
            mappings: '',
          },
        }
      }
      return BASE_CODE
    },
    compile() {},
  }

  const mainTemplate: TemplateConfig = {
    name: 'main.njs',
    alias: ['main.njs'],
    script: (context, _content, partial) => {
      const first = partial(context, 'partial.njs')
      const withMap = partial(context, 'partial.njs', {
        sourceMap: true,
        sourceFile: 'main.js',
        sourceRoot: '/app',
      })
      const again = partial(context, 'partial.njs')
      const withMapAgain = partial(context, 'partial.njs', {
        sourceMap: true,
        sourceFile: 'main.js',
        sourceRoot: '/app',
      })
      return JSON.stringify({ first, withMap, again, withMapAgain })
    },
    compile() {},
  }

  return {
    'partial.njs': partialTemplate,
    'main.njs': mainTemplate,
  }
}

const expectMapPayload = (value: unknown, file: string) => {
  expect(value).toEqual({
    code: BASE_CODE,
    map: {
      version: 3,
      file,
      sourceRoot: '/app',
      sources: ['partial.njs'],
      names: [],
      mappings: '',
    },
  })
}

const createFactory = (calls: Array<any>) =>
  new TestFactory(createTemplates(calls))

describe('partial sourcemap behaviour', () => {
  it('returns strings by default and objects only when sourcemap is requested', () => {
    const calls: Array<any> = []
    const factory = createFactory(calls)
    factory.options.sourceMap = true

    const json = factory.run({}, 'main.njs') as string
    const result = JSON.parse(json) as {
      first: string
      withMap: { code: string; map: Record<string, unknown> }
      again: string
      withMapAgain: { code: string; map: Record<string, unknown> }
    }

    expect(result.first).toBe(BASE_CODE)
    expect(result.again).toBe(BASE_CODE)
    expectMapPayload(result.withMap, 'main.js')
    expectMapPayload(result.withMapAgain, 'main.js')
    expect(result.withMap).not.toBe(result.withMapAgain)
    expect(calls.map((c) => c.sourceMap)).toEqual([false, true, false, true])
  })

  it('runPartial honours explicit sourcemap options and leaves defaults untouched', async () => {
    const calls: Array<any> = []
    const factory = createFactory(calls)
    factory.options.sourceMap = true

    const defaultResult = factory.runPartial({
      context: {},
      name: 'partial.njs',
    })
    expect(defaultResult).toBe(BASE_CODE)

    const mapResult = factory.runPartial({
      context: {},
      name: 'partial.njs',
      options: {
        sourceMap: true,
        sourceFile: 'custom.js',
        sourceRoot: '/app',
      },
    })
    expectMapPayload(mapResult, 'custom.js')

    const explicitOff = factory.runPartial({
      context: {},
      name: 'partial.njs',
      options: { sourceMap: false },
    })
    expect(explicitOff).toBe(BASE_CODE)

    const asyncResult = await factory.runPartialAsync({
      context: {},
      name: 'partial.njs',
      options: {
        sourceMap: true,
        sourceFile: 'async.js',
        sourceRoot: '/app',
      },
    })
    expectMapPayload(asyncResult, 'async.js')
    expect(calls.map((c) => c.sourceFile)).toEqual([
      undefined,
      'custom.js',
      undefined,
      'async.js',
    ])
  })
})
