import { type DefaultFactoryOption, TemplateBase } from 'fte.js-base'

export class TemplateBrowser<
  OPTIONS extends DefaultFactoryOption,
> extends TemplateBase<OPTIONS> {
  public override compile() {
    if (this.parent) {
      this.mergeParent(this.factory.ensure(this.parent))
    }
  }
}
