import {
  type DefaultFactoryOption,
  type PartialResult,
  type SlotsHash,
  type TemplateConfig,
  TemplateFactoryBase,
} from 'fte.js-base'
import { StandaloneTemplate } from './StandaloneTemplate'

const STREAM_FLAG = '__ftejs_stream_handled__'

const isAsyncIterable = (value: any): value is AsyncIterable<unknown> =>
  value != null && typeof (value as any)[Symbol.asyncIterator] === 'function'

const isIterable = (value: any): value is Iterable<unknown> =>
  value != null && typeof (value as any)[Symbol.iterator] === 'function'

const markStreamHandled = (value: any) => {
  if (value && typeof value === 'object' && !(STREAM_FLAG in value)) {
    Object.defineProperty(value, STREAM_FLAG, {
      value: true,
      enumerable: false,
      configurable: true,
    })
  }
}

const hasStreamFlag = (value: any) =>
  !!value && typeof value === 'object' && STREAM_FLAG in value

const toAsyncStrings = (src: any): AsyncIterable<string> => {
  if (typeof src === 'string') {
    return (async function* () {
      yield src
    })()
  }
  if (isAsyncIterable(src)) {
    return (async function* () {
      for await (const chunk of src) {
        const resolved = await Promise.resolve(chunk)
        yield resolved == null ? '' : String(resolved)
      }
    })()
  }
  if (isIterable(src)) {
    return (async function* () {
      for (const chunk of src) {
        const resolved = await Promise.resolve(chunk)
        if (resolved == null) continue
        yield String(resolved)
      }
    })()
  }
  return (async function* () {
    if (src != null) {
      const resolved = await Promise.resolve(src)
      if (resolved != null) {
        yield String(resolved)
      }
    }
  })()
}

const withOnChunk = (
  iter: AsyncIterable<string>,
  opts: any,
): AsyncIterable<string> => {
  const { onChunk, onError, maxCoalesceChunkSize } = opts || {}
  if (typeof onChunk !== 'function') {
    return iter
  }
  const maxSize =
    typeof maxCoalesceChunkSize === 'number' && maxCoalesceChunkSize > 0
      ? maxCoalesceChunkSize
      : 0
  return (async function* () {
    if (maxSize > 0) {
      let buffer = ''
      for await (const chunk of iter) {
        buffer += chunk
        if (buffer.length >= maxSize) {
          try {
            onChunk(buffer)
          } catch (error) {
            if (typeof onError === 'function') {
              onError(error)
            }
          }
          yield buffer
          buffer = ''
        }
      }
      if (buffer.length > 0) {
        try {
          onChunk(buffer)
        } catch (error) {
          if (typeof onError === 'function') {
            onError(error)
          }
        }
        yield buffer
      }
      return
    }
    for await (const chunk of iter) {
      try {
        onChunk(chunk)
      } catch (error) {
        if (typeof onError === 'function') {
          onError(error)
        }
      }
      yield chunk
    }
  })()
}

const applyDeindentIfNeeded = (
  iter: AsyncIterable<string>,
  opts: any,
): AsyncIterable<string> => {
  if (!opts?.deindent || typeof opts?.applyDeindentStream !== 'function') {
    return iter
  }
  const result = opts.applyDeindentStream(iter, opts.deindent)
  markStreamHandled(result)
  return result
}

const wrapStreamSource = (src: any, opts: any) => {
  if (src == null) return src
  if (hasStreamFlag(src)) return src
  const iter = toAsyncStrings(src)
  const withChunks = withOnChunk(iter, opts)
  const finalIter = applyDeindentIfNeeded(withChunks, opts)
  markStreamHandled(finalIter)
  return finalIter
}

/**
 * We must ensure that template is registered with its compiled templates
 */

export class TemplateFactoryStandalone<
  OPTIONS extends DefaultFactoryOption,
> extends TemplateFactoryBase<OPTIONS> {
  private templates: Record<string, TemplateConfig<OPTIONS>>

  constructor(templates: Record<string, TemplateConfig<OPTIONS>>) {
    super()
    this.templates = templates
    this.preload()
  }
  public resolveTemplateConfig(fileName: string): TemplateConfig<OPTIONS> {
    const result = this.templates[fileName]
    if (result) {
      result.factory = this
      result.name = fileName
      return result
    } else {
      throw new Error(`template ${fileName} not found`)
    }
  }

  public override load(fileName: string) {
    const template = this.resolveTemplateConfig(fileName)
    const templ = new StandaloneTemplate<OPTIONS>(template)
    this.register(templ, fileName)
    templ.compile()
    return templ
  }
  public override preload() {
    Object.keys(this.templates).forEach((t) => this.load(t))
  }
  public override run<T>(
    context: T,
    name: string,
  ): string | Array<{ name: string; content: string }> {
    const templ = this.ensure(name)
    const bc = this.blockContent(templ)
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options)
  }

  public async runAsync<T>(
    context: T,
    name: string,
  ): Promise<string | Array<{ name: string; content: string }>> {
    const templ = this.ensure(name)
    const bc: any = this.blockContent(templ)
    if (typeof bc.runAsync === 'function') {
      return bc.runAsync(context, bc.content, bc.partial, bc.slot, this.options)
    }
    // Fallback to sync path if template is purely sync
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options)
  }

  public runStream<T>(
    context: T,
    name: string,
  ):
    | AsyncIterable<string>
    | string
    | Array<
        | { name: string; content: string }
        | { name: string; content: AsyncIterable<string> }
      > {
    const templ = this.ensure(name)
    const bc: any = this.blockContent(templ)
    const res: any = bc.run(
      context,
      bc.content,
      bc.partial,
      bc.slot,
      this.options,
    )
    if (!(this.options as any)?.stream) {
      return res
    }
    if (Array.isArray(res)) {
      return res.map((chunk) => {
        if (!chunk) {
          return chunk
        }
        const wrapped = wrapStreamSource(chunk.content, this.options)
        return {
          ...chunk,
          content: wrapped,
        }
      })
    }
    return wrapStreamSource(res, this.options)
  }

  public override runPartial<T, OPTIONS extends DefaultFactoryOption>({
    context,
    name,
    slots,
    options,
  }: {
    context: T
    name: string
    absPath?: boolean
    options?: OPTIONS
    slots?: SlotsHash
  }): PartialResult {
    const templ = this.ensure(name)
    if (!templ.chunks) {
      const wantsSourceMap =
        options && Object.prototype.hasOwnProperty.call(options, 'sourceMap')
          ? Boolean(options.sourceMap)
          : false
      const invocationOptions = {
        ...this.options,
        ...(options ?? {}),
      } as OPTIONS
      if (!wantsSourceMap) {
        ;(invocationOptions as any).sourceMap = false
      }
      const bc = this.blockContent(templ, slots)
      const result = bc.run(
        context,
        bc.content,
        bc.partial,
        bc.slot,
        invocationOptions,
      ) as PartialResult
      if (!wantsSourceMap && result && typeof result === 'object') {
        if ('code' in result) {
          return (result as { code: string }).code
        }
      }
      return result
    } else {
      throw new Error(`can't use chunked template as partial: ${name}`)
    }
  }

  public async runPartialAsync<T, OPTIONS extends DefaultFactoryOption>({
    context,
    name,
    slots,
    options,
  }: {
    context: T
    name: string
    absPath?: boolean
    options?: OPTIONS
    slots?: SlotsHash
  }): Promise<PartialResult> {
    const templ = this.ensure(name)
    if (!templ.chunks) {
      const wantsSourceMap =
        options && Object.prototype.hasOwnProperty.call(options, 'sourceMap')
          ? Boolean(options.sourceMap)
          : false
      const invocationOptions = {
        ...this.options,
        ...(options ?? {}),
      } as OPTIONS
      if (!wantsSourceMap) {
        ;(invocationOptions as any).sourceMap = false
      }
      const bc: any = this.blockContent(templ, slots)
      const executeAsync = typeof bc.runAsync === 'function'
      const result = executeAsync
        ? await bc.runAsync(
            context,
            bc.content,
            bc.partial,
            bc.slot,
            invocationOptions,
          )
        : bc.run(
            context,
            bc.content,
            bc.partial,
            bc.slot,
            invocationOptions,
          )
      if (!wantsSourceMap && result && typeof result === 'object') {
        if ('code' in result) {
          return (result as { code: string }).code
        }
      }
      return result as PartialResult
    } else {
      throw new Error(`can't use chunked template as partial: ${name}`)
    }
  }
}
