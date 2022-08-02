import { TemplateBrowser } from './template'
import { TemplateFactoryBase } from '../common/factory'
import { HashType, SlotsHash } from '../common/interfaces'
import { TemplateConfig } from '../common/interfaces'
import { DefaultFactoryOption } from '../common/interfaces'

/**
 * We must ensure that template is registered with its compiled templates
 */

export class TemplateFactoryStandalone<
  T extends DefaultFactoryOption,
> extends TemplateFactoryBase<T> {
  private templates: Record<string, TemplateConfig<T>>

  constructor(templates: Record<string, TemplateConfig<T>>) {
    super()
    this.templates = templates
    this.preload()
  }
  public resolveTemplateConfig(fileName: string): TemplateConfig<T> {
    const result = this.templates[fileName]
    if (result) {
      result.factory = this
      result.name = fileName
      return result
    } else {
      throw new Error(`template ${fileName} not found`)
    }
  }

  public load(fileName: string) {
    const template = this.resolveTemplateConfig(fileName)
    const templ = new TemplateBrowser<T>(template)
    this.register(templ, fileName)
    templ.compile()
    return templ
  }
  public preload() {
    Object.keys(this.templates).forEach((t) => this.load(t))
  }
  public run<T extends Record<string, any>>(
    context: HashType,
    name: string,
  ): string | Array<{ name: string; content: string }> {
    const templ = this.ensure(name)
    const bc = this.blockContent(templ)
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options)
  }

  public runPartial<T extends Record<string, any>>({
    context,
    name,
    slots,
  }: {
    context: HashType
    name: string
    absPath?: boolean
    options?: T
    slots?: SlotsHash
  }): string {
    const templ = this.ensure(name)
    if (!templ.chunks) {
      const bc = this.blockContent(templ, slots)
      return bc.run(
        context,
        bc.content,
        bc.partial,
        bc.slot,
        this.options,
      ) as string
    } else {
      throw new Error("cant't use template with chunks as partial")
    }
  }
}
