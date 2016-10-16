import { TemplateBrowser } from './template';
import { TemplateFactoryBase } from './../common/factory';
import { HashType } from './../common/interfaces';

export class TemplateFactoryBrowser extends TemplateFactoryBase {
  public load(result, fileName) {
    result.name = fileName;
    result.factory = this;
    let templ = new TemplateBrowser(result);
    this.register(templ, fileName);
    templ.compile();
    return templ;
  }

  public run(context: HashType, name: string, absPath?: boolean): string {
    let templ = this.ensure(name);
    let bc = this.blockContent(templ);
    return bc.run(context, bc.content, bc.partial);
  }
}
