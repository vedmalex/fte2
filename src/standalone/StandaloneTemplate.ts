import { DefaultFactoryOption } from '../common/types/DefaultFactoryOption'
import { TemplateBase } from '../common/types/TemplateBase'

export class StandaloneTemplate<T extends DefaultFactoryOption> extends TemplateBase<T> {
  public override compile() {
    if (this.parent) {
      this.mergeParent(this.factory.ensure(this.parent))
    }
  }
}
