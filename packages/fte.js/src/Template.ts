import { type DefaultFactoryOption, TemplateBase } from 'fte.js-base'
import { makeTemplate } from './makeTemplate'

export class Template<T extends DefaultFactoryOption> extends TemplateBase<T> {
  public override compile() {
    if (this.srcCode) {
      const result = makeTemplate(this.srcCode, false)
      if (!result.error) {
        this.script = result.script
        this.blocks = result.blocks
        this.slots = result.slots
        this.compile = result.compile
        this.dependency = result.dependency
        if (result.alias) {
          this.alias = result.alias
        }
        this.compile()
      } else {
        throw result.error
      }
    }
    return this
  }
}
