
import { TemplateBase } from './../common/template';
import { makeTemplate } from './helpers';

export class Template extends TemplateBase {
  public compile() {
    if (this.srcCode) {
      let result = makeTemplate(this.srcCode);
      if (!result.error) {
        this.script = result.script;
        this.blocks = result.blocks;
        this.compile = result.compile;
        this.dependency = result.dependency;
        if (result.alias) {
          this.alias = result.alias;
        }
        this.compile();
      } else {
        throw result.error;
      }
    }
    return this;
  }
}
