import { DefaultFactoryOption, SlotsHash, TemplateConfig, TemplateFactoryBase } from 'fte.js-base'
import { StandaloneTemplate } from './StandaloneTemplate'

/**
 * We must ensure that template is registered with its compiled templates
 */

export class TemplateFactoryStandalone<OPTIONS extends DefaultFactoryOption> extends TemplateFactoryBase<OPTIONS> {
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
    Object.keys(this.templates).forEach(t => this.load(t))
  }
  public override run<T>(context: T, name: string): string | Array<{ name: string; content: string }> {
    const templ = this.ensure(name)
    const bc = this.blockContent(templ)
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options)
  }

  public async runAsync<T>(context: T, name: string): Promise<string | Array<{ name: string; content: string }>> {
    const templ = this.ensure(name)
    const bc: any = this.blockContent(templ)
    if (typeof bc.runAsync === 'function') {
      return bc.runAsync(context, bc.content, bc.partial, bc.slot, this.options)
    }
    // Fallback to sync path if template is purely sync
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options)
  }

  public runStream<T>(context: T, name: string): AsyncIterable<string> | string | Array<{ name: string; content: string } | { name: string; content: AsyncIterable<string> }> {
    const templ = this.ensure(name)
    const bc: any = this.blockContent(templ)
    const res: any = bc.run(context, bc.content, bc.partial, bc.slot, this.options)
    // When stream mode is enabled, compiled template returns an async generator
    return res
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
  }): string {
    const templ = this.ensure(name)
    if (!templ.chunks) {
      const bc = this.blockContent(templ, slots)
      return bc.run(context, bc.content, bc.partial, bc.slot, { ...this.options, ...options }) as string
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
  }): Promise<string> {
    const templ = this.ensure(name)
    if (!templ.chunks) {
      const bc: any = this.blockContent(templ, slots)
      if (typeof bc.runAsync === 'function') {
        return (await bc.runAsync(context, bc.content, bc.partial, bc.slot, { ...this.options, ...options })) as string
      }
      return bc.run(context, bc.content, bc.partial, bc.slot, { ...this.options, ...options }) as string
    } else {
      throw new Error(`can't use chunked template as partial: ${name}`)
    }
  }
}
