import {
  type ChunkContent,
  type DefaultFactoryOption,
  type PartialResult,
  type RunPartialContext,
  type TemplateConfig,
  TemplateFactoryBase,
} from 'fte.js-base'
import { TemplateBrowser } from './TemplateBrowser'
export class TemplateFactoryBrowser<
  OPTIONS extends DefaultFactoryOption,
> extends TemplateFactoryBase<OPTIONS> {
  public resolveTemplateConfig(fileName: string): TemplateConfig<OPTIONS> {
    const result = (globalThis as any).fte(fileName) as TemplateConfig<OPTIONS>
    result.factory = this
    result.name = fileName
    return result
  }

  public override load(fileName: string, absPath?: boolean) {
    const template = this.resolveTemplateConfig(fileName)
    const templ = new TemplateBrowser<OPTIONS>(template)
    this.register(templ, fileName)
    templ.compile()
    return templ
  }

  public override run<T>(
    context: T,
    name: string,
  ): string | Array<ChunkContent> {
    const templ = this.ensure(name)
    const bc = this.blockContent(templ)
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options)
  }

  public async runAsync<T>(
    context: T,
    name: string,
  ): Promise<string | Array<ChunkContent>> {
    const templ = this.ensure(name)
    const bc: any = this.blockContent(templ)
    return bc.runAsync(context, bc.content, bc.partial, bc.slot, this.options)
  }

  public runStream<T>(
    context: T,
    name: string,
  ):
    | AsyncIterable<string>
    | string
    | Array<ChunkContent | { name: string; content: AsyncIterable<string> }> {
    const templ = this.ensure(name)
    const bc: any = this.blockContent(templ)
    const res: any = bc.run(
      context,
      bc.content,
      bc.partial,
      bc.slot,
      this.options,
    )
    return res
  }

  public override runPartial<T>({
    context,
    name,
    options,
    slots,
  }: RunPartialContext<T, OPTIONS>): PartialResult {
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

  public async runPartialAsync<T>({
    context,
    name,
    options,
    slots,
  }: RunPartialContext<T, OPTIONS>): Promise<PartialResult> {
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
      const result = await bc.runAsync(
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
