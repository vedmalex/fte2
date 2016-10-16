import { TemplateBase } from '../common/template/';

export class TemplateBrowser extends TemplateBase {
  public compile() {
    if (this.parent) {
      this.mergeParent(this.factory.ensure(this.parent));
    }
  }
}
