import { TemplateBrowser } from './template'
import { TemplateFactoryBase } from './../common/factory'
import { HashTypeGeneric, HashType, SlotsHash } from './../common/interfaces'
import { TemplateConfig } from './../common/interfaces'
import { DefaultFactoryOption } from '../common/interfaces'

/**
 * We must ensure that template is registered with its compiled templates
 */
declare let global: {
  fte<T extends DefaultFactoryOption>(filename): TemplateConfig<T>
}

export class TemplateFactoryBrowser<
  T extends DefaultFactoryOption,
> extends TemplateFactoryBase<T> {
  public resolveTemplateConfig(fileName: string): TemplateConfig<T> {
    const result = global.fte<T>(fileName)
    result.factory = this
    result.name = fileName
    return result
  }

  public load(fileName: string, absPath?: boolean) {
    const template = this.resolveTemplateConfig(fileName)
    const templ = new TemplateBrowser<T>(template)
    this.register(templ, fileName)
    templ.compile()
    return templ
  }

  public run<T extends Record<string, any>>({
    context,
    name,
    absPath,
    options,
    slots,
  }: {
    context: HashType
    name: string
    absPath?: boolean
    options: T
    slots?: SlotsHash
  }): string | Array<object> {
    const templ = this.ensure(name)
    const bc = this.blockContent(templ, slots)
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options)
  }

  public runPartial<T extends Record<string, any>>({
    context,
    name,
    absPath,
    options,
    slots,
  }: {
    context: HashType
    name: string
    absPath?: boolean
    options: T
    slots?: SlotsHash
  }): string {
    const templ = this.ensure(name)
    const bc = this.blockContent(templ, slots)
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options)
  }
}
