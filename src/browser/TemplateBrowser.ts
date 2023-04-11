import { DefaultFactoryOption } from '../common/types/DefaultFactoryOption'
import { TemplateBase } from '../common/types/TemplateBase'

export class TemplateBrowser<OPTIONS extends DefaultFactoryOption> extends TemplateBase<OPTIONS> {
  public override compile() {
    if (this.parent) {
      this.mergeParent(this.factory.ensure(this.parent))
    }
  }
}
