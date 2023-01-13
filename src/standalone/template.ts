import { DefaultFactoryOption } from '../common/interfaces'
import { TemplateBase } from '../common/template'

export class TemplateBrowser<
  T extends DefaultFactoryOption,
> extends TemplateBase<T> {
  public override compile() {
    if (this.parent) {
      this.mergeParent(this.factory.ensure(this.parent))
    }
  }
}
