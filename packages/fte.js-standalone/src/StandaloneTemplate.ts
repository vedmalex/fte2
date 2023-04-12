import { DefaultFactoryOption, TemplateBase } from 'fte.js-base'

export class StandaloneTemplate<T extends DefaultFactoryOption> extends TemplateBase<T> {
  public override compile() {
    if (this.parent) {
      this.mergeParent(this.factory.ensure(this.parent))
    }
  }
}
