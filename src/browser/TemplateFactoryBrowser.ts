import { RunPartialContext } from '../common/types/RunPartialContext'
import { DefaultFactoryOption } from '../common/types/DefaultFactoryOption'
import { TemplateConfig } from '../common/types/TemplateConfig'
import { TemplateFactoryBase } from '../common/types/TemplateFactoryBase'
import { TemplateBrowser } from './TemplateBrowser'
import { ChunkContent } from '../common/types/ChunkContent'
import { global } from './factory'

export class TemplateFactoryBrowser<OPTIONS extends DefaultFactoryOption> extends TemplateFactoryBase<OPTIONS> {
  public resolveTemplateConfig(fileName: string): TemplateConfig<OPTIONS> {
    const result = global.fte<OPTIONS>(fileName)
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

  public override run<T>(context: T, name: string): string | Array<ChunkContent> {
    const templ = this.ensure(name)
    const bc = this.blockContent(templ)
    return bc.run(context, bc.content, bc.partial, bc.slot, this.options)
  }

  public override runPartial<T>({ context, name, options, slots }: RunPartialContext<T, OPTIONS>): string {
    const templ = this.ensure(name)
    if (!templ.chunks) {
      const bc = this.blockContent(templ, slots)
      return bc.run(context, bc.content, bc.partial, bc.slot, { ...this.options, ...(options ?? {}) }) as string
    } else {
      throw new Error("cant't use template with chunks as partial")
    }
  }
}
