import { TemplateBrowser } from './template'
import { TemplateFactoryBase } from './../common/factory'
import { HashTypeGeneric, HashType } from './../common/interfaces'
import { TemplateConfig } from './../common/interfaces'

/**
 * We must ensure that template is registered with its compiled templates
 */
declare let global: { fte: HashTypeGeneric<TemplateConfig> }

export class TemplateFactoryBrowser extends TemplateFactoryBase {
  public resolveTemplateConfig(fileName: string): TemplateConfig {
    const result = global.fte[fileName]
    result.factory = this
    result.name = fileName
    return result
  }

  public load(fileName: string, absPath?: boolean) {
    const template = this.resolveTemplateConfig(fileName)
    const templ = new TemplateBrowser(template)
    this.register(templ, fileName)
    templ.compile()
    return templ
  }

  public run(
    context: HashType,
    name: string,
    absPath?: boolean,
  ): string | Array<object> {
    const templ = this.ensure(name)
    const bc = this.blockContent(templ)
    return bc.run(context, bc.content, bc.partial, bc.slot)
  }

  public runPartial(
    context: HashType,
    name: string,
    absPath?: boolean,
  ): string {
    const templ = this.ensure(name)
    const bc = this.blockContent(templ)
    return bc.run(context, bc.content, bc.partial, bc.slot)
  }
}
